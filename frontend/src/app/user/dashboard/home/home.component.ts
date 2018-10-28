import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms'

import { Component, OnInit } from '@angular/core';
import { AuthUserService } from '../../../shared/services/user/auth-user.service'
import { UserHomeService } from '../../../shared/services/user/home.service'

import { sparkline, donutChart, oneLineChart} from '../../../app.helpers'

@Component({
    selector: 'user-home',
    templateUrl: './home.component.html',
})

export class UserHomeComponent implements OnInit {
    form: FormGroup;
    processing = false;
    public have_error = false;
    public is_success = false;
    public message;
    obj;
    history_rewards = []
    total_earnings = 0;
    annual_return = 0;
    total_own_node = 0;
    portofolio = []
    chart_token = 'WGR'
    available_withdrawl = false;
    constructor(
        private formBuilder: FormBuilder,
        private service: UserHomeService,
    ){
        this.service.get().subscribe(data => {
            this.obj = data;
            if(data.user_nodes_rewards.length > 0) {
                for(var i=0; i < data.user_nodes_rewards.length; i++) {
                    this.total_earnings += data.user_nodes_rewards[i].amount
                }
            }
            if(data.nodes.length > 0) {
                for(var i=0; i < data.nodes.length; i++) {
                    if(this.portofolio.length > 0) {
                        var is_exist = false;
                        for(var c=0; c < this.portofolio.length; c++) {

                            if(data.nodes[i].token_id == this.portofolio[c].token_id) {
                                this.portofolio[c]["amount"] += data.nodes[i].total_amount
                                is_exist = true;
                            }
                        }
                        if(!is_exist) {
                            this.portofolio.push({
                                token_id: data.nodes[i].token_id,
                                label: data.nodes[i].token_symbol,
                                amount: data.nodes[i].total_amount,
                                value: 0
                            })
                        }
                    }
                    else {
                        this.portofolio.push({
                            token_id: data.nodes[i].token_id,
                            label: data.nodes[i].token_symbol,
                            amount: data.nodes[i].total_amount,
                            value: 0
                        })
                    }
                    this.total_own_node += data.nodes[i].total_amount 
                    if(this.portofolio.length > 0) {
                        for(var c3=0; c3 < this.portofolio.length; c3++) {
                            this.portofolio[c3].value = (this.portofolio[c3].amount / this.total_own_node) * 100;
                        }
                    }


                    var user_percentage_reward = data.nodes[i].total_amount / data.nodes[i].node_total_tokens ;
                    var daily_rewards_amount = data.nodes[i].daily_rewards * user_percentage_reward;

                    this.annual_return += daily_rewards_amount * 365
                }
            }
            if(data.user_nodes_rewards.length > 0) {
                for(var i=0; i <data.user_nodes_rewards.length; i++) {
                    if(!data.user_nodes_rewards.withdrawl_at)
                        this.available_withdrawl = true;
                }
            }
            this.history_rewards = data.user_nodes_rewards

            donutChart(this.portofolio);
        }, (err) => {
            console.log(err._body)
        })
    }    

    ngOnInit(){
        sparkline();
        oneLineChart();
    }

    withdraw() {
        if(confirm("would you like to proceed? ")) {
            this.have_error = false;
            this.processing = true;

            this.service.withdrawl().subscribe(res => {
               for(var i=0; i < res.withdrawls.length; i++) {
                   for(var c=0; c < this.history_rewards.length; c++) {
                        if(this.history_rewards[c].id == res.withdrawls[i].id)
                            this.history_rewards[c].withdrawl_at = res.withdrawls[i].withdraw_at
                   }
                   this.available_withdrawl = false;
               }
            }, (err) => {
                this.have_error = true;
                this.message = err._body;
                this.processing = false;
            })
        }
    }
}
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms'

import { Component, OnInit } from '@angular/core';
import { AuthUserService } from '../../../shared/services/user/auth-user.service'
import { UserHomeService } from '../../../shared/services/user/home.service'

import { sparkline, oneLineChart} from '../../../app.helpers'

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
    constructor(
        private formBuilder: FormBuilder,
        private service: UserHomeService,
    ){
        this.service.get().subscribe(data => {
            this.obj = data;
            console.log(this.obj)
            if(data.user_nodes_rewards.length > 0) {
                for(var i=0; i < data.user_nodes_rewards.length; i++) {
                    this.total_earnings += data.user_nodes_rewards[i].amount
                }
            }
            if(data.nodes.length > 0) {
                for(var i=0; i < data.nodes.length; i++) {
                    this.total_own_node += data.nodes[i].total_amount 
                    var user_percentage_reward = data.nodes[i].total_amount / data.nodes[i].node_total_tokens ;
                    var daily_rewards_amount = data.nodes[i].daily_rewards * user_percentage_reward;

                    this.annual_return += daily_rewards_amount * 365
                }
            }
            console.log(this.annual_return)
            console.log(this.total_own_node)

            this.history_rewards = data.user_nodes_rewards



        }, (err) => {
            console.log(err._body)
        })
    }    

    ngOnInit(){
        sparkline();
        oneLineChart();
    }
}
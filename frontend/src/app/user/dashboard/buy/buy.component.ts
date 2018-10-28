import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms'

import { Component, OnInit } from '@angular/core';
import { AuthUserService } from '../../../shared/services/user/auth-user.service'
import { UserBuyService } from '../../../shared/services/user/buy.service'
import { openModal, closeModal } from '../../../app.helpers'
@Component({
    selector: 'user-buy',
    templateUrl: './buy.component.html',
})

export class UserBuyComponent implements OnInit {
    form: FormGroup;
    processing = false;
    public have_error = false;
    public is_success = false;
    public message;
    obj;
    selected_node_id;
    selected_amount;
    nodes = []
    constructor(
        private formBuilder: FormBuilder,
        private service: UserBuyService,
    ){
        this.service.get().subscribe(data => {
            this.obj = data;
            for(var i=0; i < this.obj.nodes.length; i++) {
                this.obj.nodes[i]["available_amount"] = this.obj.nodes[i].total_tokens - this.obj.nodes[i].total_user_amount
            }
        }, (err) => {
            console.log(err._body)
        })
    }    

    ngOnInit(){
    }
    buy(node_id, amount) {
        console.log(amount)
        this.closeModal();
        if(confirm("would you like to proceed? ")) {
            this.have_error = false;
            this.processing = true;

            this.service.buy({
                node_id : node_id,
                amount: amount
            }).subscribe(res => {
                for(var i=0; i < this.obj.nodes.length; i++) {
                    if(this.obj.nodes[i].id == node_id) {
                        this.obj.nodes[i].total_user_amount += parseInt(amount)
                    }
                }
                this.processing = false;
            }, (err) => {
                this.have_error = true;
                this.message = err._body;
                this.processing = false;
            })
        }
    }

    openModalInit(node_id) {
        this.selected_node_id = node_id
        openModal("buyModal")
    }

    closeModal() {
        closeModal("buyModal");
    }
}
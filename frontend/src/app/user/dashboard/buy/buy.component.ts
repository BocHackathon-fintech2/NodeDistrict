import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms'

import { Component, OnInit } from '@angular/core';
import { AuthUserService } from '../../../shared/services/user/auth-user.service'
import { UserBuyService } from '../../../shared/services/user/buy.service'

@Component({
    selector: 'user-buy',
    templateUrl: './buy.component.html',
})

export class UserHomeComponent implements OnInit {
    form: FormGroup;
    processing = false;
    public have_error = false;
    public is_success = false;
    public message;
    obj;
    constructor(
        private formBuilder: FormBuilder,
        private service: UserBuyService,
    ){
        this.service.get().subscribe(data => {
            this.obj = data;
            
        }, (err) => {
            console.log(err._body)
        })
    }    

    ngOnInit(){}
}
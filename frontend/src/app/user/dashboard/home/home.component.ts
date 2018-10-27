import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms'

import { Component, OnInit } from '@angular/core';
import { AuthUserService } from '../../../shared/services/user/auth-user.service'

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

    constructor(
        private formBuilder: FormBuilder,
        private service: AuthUserService,
    ){
        window.scrollTo(0, 0)
    }    

    ngOnInit(){}
}
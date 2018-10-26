import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms'

import { AdminUsersService } from '../../../../shared/services/admin/admin-users.service'
import { datepicker, formatDate } from '../../../../app.helpers';

declare var jQuery:any;
@Component({
    selector: 'admin-users-route',
    templateUrl: './edit.component.html'
})


export class AdminUsersEditComponent implements OnInit{
    form: FormGroup;
    id;
    public is_active = false;
    public obj;
    processing = false;
    have_error = false;
    message;
    constructor(  
        private formBuilder: FormBuilder,
        private _location: Location,
        private service: AdminUsersService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ){
        this.activatedRoute.params.subscribe((params: Params) => {
            this.id = params['id'];
            this.edit(this.id);
        });
        
    }

    backClicked() {
        this._location.back();
    }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.form = this.formBuilder.group({
            first_name: ['', Validators.compose([
                Validators.required,
            ])],
            last_name: ['', Validators.compose([
                Validators.required
            ])],
            email: ['', Validators.compose([
                Validators.required,
                this.validateEmail // Custom validation
            ])],
            password: ['', Validators.compose([
                this.validatePassword
            ])],
            is_active: ['', Validators.compose([
            ])],
        });
    };

    validateEmail(controls) {
        // Create a regular expression
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        // Test email against regular expression
        if (regExp.test(controls.value))
            return null; // Return as valid email
        else
            return { 'validateEmail': true } // Return as invalid email
    }

    validatePassword(controls) {
        // Create a regular expression
        if(controls.value != "") {
            const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
            // Test password against regular expression
            if (regExp.test(controls.value))
                return null; // Return as valid password
            else
                return { 'validatePassword': true } // Return as invalid password
        }
        else
            return null;
    }


    disableForm() {
        this.form.controls['first_name'].disable();
        this.form.controls['last_name'].disable();
        this.form.controls['email'].disable();
        this.form.controls['password'].disable();
        this.form.controls['is_active'].disable();
    }

    enableForm() {
        this.form.controls['first_name'].enable();
        this.form.controls['last_name'].enable();
        this.form.controls['email'].enable();
        this.form.controls['password'].enable();
        this.form.controls['is_active'].enable();
    }

    edit(id) {
        this.service.edit(id).subscribe(data => {
            this.obj = data;
            this.form.controls['first_name'].setValue(data.first_name);
            this.form.controls['last_name'].setValue(data.last_name);
            this.form.controls['email'].setValue(data.email);
            this.form.controls['is_active'].setValue(data.is_active);
            if(data.is_active)
                this.is_active = true;
        }, (err) => {
            this.have_error = true;
            this.message = err._body;
        })
    }

    onCheckedSelect(event) {
        this.form.controls['is_active'].setValue(event.target.checked);
    }

    onSaveSubmit() {
        this.have_error = false;
        this.processing = true;
        this.disableForm();

        var active = 0;
        if(this.form.get('is_active').value)
            active = 1;

        this.service.saveEdit({
            id : this.id,
            first_name : this.form.get('first_name').value,
            last_name: this.form.get('last_name').value,
            email: this.form.get('email').value,
            password: this.form.get('password').value,
            is_active: active,
        }).subscribe(res => {
            this.router.navigate([`/admins/view/${this.id}`])
        }, (err) => {
            this.have_error = true;
            this.message = err._body;
            this.processing = false;
            this.enableForm();
        })
    }
}
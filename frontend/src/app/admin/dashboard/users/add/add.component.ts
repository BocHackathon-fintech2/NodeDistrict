import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms'

import { UsersService } from '../../../../shared/services/admin/users.service'
import { datepicker, formatDate } from '../../../../app.helpers';

@Component({
    selector: 'user-add-route',
    templateUrl: './add.component.html'
})


export class UsersAddComponent implements OnInit{
    form: FormGroup;
    processing = false;
    have_error = false;

    message;
    constructor(  
        private formBuilder: FormBuilder,
        private _location: Location,
        private service: UsersService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ){}

    backClicked() {
        this._location.back();
    }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.form = this.formBuilder.group({
            first_name: ['', Validators.compose([
                Validators.maxLength(30),
                Validators.required,
            ])],
            last_name: ['', Validators.compose([
                Validators.maxLength(30),
                Validators.required
            ])],
            email: ['', Validators.compose([
                Validators.required,
                this.validateEmail // Custom validation
            ])],
            password: ['', Validators.compose([
                Validators.required,
                this.validatePassword
            ])],
            is_verified: ['', Validators.compose([
            ])]
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
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        // Test password against regular expression
        if (regExp.test(controls.value))
            return null; // Return as valid password
        else
            return { 'validatePassword': true } // Return as invalid password
    }


    disableForm() {
        this.form.controls['first_name'].disable();
        this.form.controls['last_name'].disable();
        this.form.controls['email'].disable();
        this.form.controls['password'].disable();
        this.form.controls['is_verified'].disable();
    }

    enableForm() {
        this.form.controls['first_name'].enable();
        this.form.controls['last_name'].enable();
        this.form.controls['email'].enable();
        this.form.controls['password'].enable();
        this.form.controls['is_verified'].enable();
    }

    onCheckedSelect(event) {
        this.form.controls['is_verified'].setValue(event.target.checked);
    }

    onSaveSubmit() {
        this.have_error = false;
        this.processing = true;
        this.disableForm();

        var verified = 0;
        if(this.form.get('is_verified').value)
            verified = 1;

        this.service.saveAdd({
            first_name : this.form.get('first_name').value,
            last_name: this.form.get('last_name').value,
            email: this.form.get('email').value,
            password: this.form.get('password').value,
            is_verified: verified,
        }).subscribe(res => {
            this.router.navigate([`/admin/users/view/${res.id}`])
        }, (err) => {
            this.have_error = true;
            this.message = err._body;
            this.processing = false;
            this.enableForm();
        })
    }
}
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthAdminService } from '../../../shared/services/admin/auth-admin.service'

@Component({
    selector: 'app-admin-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
  })

  export class AdminLoginComponent implements OnInit {
    form: FormGroup;
    messageClass;
    message;
    processing = false;
    loading = false;

    constructor(  
        private formBuilder: FormBuilder,
        private authAdminService: AuthAdminService,
        private router: Router,
        private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.createForm();
    }

    // Function to create login form
    createForm() {
        this.form = this.formBuilder.group({ 
        email: ['', Validators.compose([
            Validators.required, // Field is required
            Validators.minLength(5), // Minimum length is 5 characters
            Validators.maxLength(30), // Maximum length is 30 characters
            this.validateEmail // Custom validation
        ])],
        password: ['', Validators.required] // Password field
        });
    }

    // Function to disable form
    disableForm() {
        this.form.controls['email'].disable(); // Disable email field
        this.form.controls['password'].disable(); // Disable password field
    }

    // Function to enable form
    enableForm() {
        this.form.controls['email'].enable(); // Enable email field
        this.form.controls['password'].enable(); // Enable password field
    }

    // Functiont to submit form and login user
    onLoginSubmit() {
        this.processing = true; // Used to submit button while is being processed
        this.disableForm(); // Disable form while being process
        // Create user object from user's input
        const user = {
            email: this.form.get('email').value, // email input field
            password: this.form.get('password').value, // Password input field
        }
        // Function to send login data to API
        this.authAdminService.login(user).subscribe(res => {
            this.authAdminService.storeUserData(res.token,res.admin, (err, done) => {
                this.router.navigate(['cows']);
            });
        }, (err) => {
            this.messageClass = 'alert alert-danger'; // Set bootstrap error class
            this.message = err._body; // Set error message
            this.processing = false; // Enable submit button
            this.enableForm(); // Enable form for editting
        });
    }

    // Function to validate e-mail is proper format
    validateEmail(controls) {
        // Create a regular expression
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        // Test email against regular expression
        if (regExp.test(controls.value))
            return null; // Return as valid email
        else
            return { 'validateEmail': true } // Return as invalid email
    }

}

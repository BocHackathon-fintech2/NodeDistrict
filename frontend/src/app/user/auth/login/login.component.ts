import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthUserService } from '../../../shared/services/user/auth-user.service'
import { CookieService, CookieOptions } from 'angular2-cookie/core';

@Component({
    selector: 'app-user-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
  })

  export class UserLoginComponent implements OnInit {
    form: FormGroup;
    messageClass;
    message;
    processing = false;
    loading = false;

    constructor(  
        private formBuilder: FormBuilder,
        private authUserService: AuthUserService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _cookieService:CookieService
    ) {}

    ngOnInit() {
        this.createForm();
    }

    // Function to create login form
    createForm() {
        this.form = this.formBuilder.group({ 
        email: ['', Validators.compose([
            Validators.required // Field is required
        ])],
        password: ['', Validators.required], // Password field
        remember_me: ['']
        });
    }

    // Function to disable form
    disableForm() {
        this.form.controls['email'].disable(); // Disable email field
        this.form.controls['password'].disable(); // Disable password field
        this.form.controls['remember_me'].disable();
    }

    // Function to enable form
    enableForm() {
        this.form.controls['email'].enable(); // Enable email field
        this.form.controls['password'].enable(); // Enable password field
        this.form.controls['remember_me'].enable()
    }

    

    // Functiont to submit form and login user
    onLoginSubmit() {
        this.processing = true; // Used to submit button while is being processed
        this.disableForm(); // Disable form while being process
        // Create user object from user's input
        const user = {
            email: this.form.get('email').value, // email input field
            password: this.form.get('password').value, // Password input field
            remember_me: this.form.get('remember_me').value
        }
        // Function to send login data to API
        this.authUserService.login(user).subscribe(res => {
            this.authUserService.storeUserData(res.token,res.user, (err, done) => {
                if(user.remember_me) {
                    this._cookieService.put('username', user.email);
                    this._cookieService.put('password', user.password);
                    this._cookieService.put('remember', user.remember_me);
                }
                if(res.user_current_players_exists) {
                    localStorage.setItem("user_current_players_exists", "true")
                    this.router.navigate(['/user/my-team']);
                }
                else
                    this.router.navigate(['/user/squad-selection'])
            });
        }, (err) => {
            this.messageClass = 'alert alert-danger'; // Set bootstrap error class
            this.message = err._body; // Set error message
            this.processing = false; // Enable submit button
            this.enableForm(); // Enable form for editting
        });
    }

}

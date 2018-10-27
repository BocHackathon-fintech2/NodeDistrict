import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import 'rxjs/add/operator/map';

import { environment } from '../../../../environments/environment'
import { CookieService } from 'angular2-cookie/core';
@Injectable()
export class AuthUserService {

    constructor(
        private http: Http,
        public jwtHelper: JwtHelper,
        private _cookieService:CookieService
    ) {}

    authToken;
    user;

    // Function to create headers, add token, to be used in HTTP requests
    createAuthenticationHeaders() {
        this.loadToken();
        // Headers configuration options
        return new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'authorization': this.authToken
            })
        })
    }

    // Function to get token from client local storage
    loadToken() {
        this.authToken = localStorage.getItem('user_token'); // Get token and asssign to variable to be used elsewhere
    }
    
    // Function to remove token from client local storage
    removeToken() {
        if(this._cookieService.get('username') && this._cookieService.get('password') && this._cookieService.get('remember')) {
            this._cookieService.removeAll();
        }
        localStorage.removeItem('user_token');
        localStorage.removeItem('user');
        this.authToken = null;
        this.user = null;
    }

    // Function to login user
    login(user) {
        return this.http.post(environment.apiUrl + '/user/auth/login', user).map(res => res.json());
    }

    // Function to store user's data in client local storage
    storeUserData(user_token, user, done) {
        localStorage.setItem('user_token', user_token); // Set token in local storage
        localStorage.setItem('user', JSON.stringify(user)); // Set user in local storage as string
        this.authToken = user_token; // Assign token to be used elsewhere
        this.user = user; // Set user to be used elsewhere
        done(null,true);
    }

    forgotPassword(data) {
        return this.http.post(environment.apiUrl + '/user/auth/forgotpassword/', data).map(res => res.json());
    }

    checkUserLogin() {
        return this.http.get(
            environment.apiUrl + '/user/auth/checklogin',
            this.createAuthenticationHeaders()
        ).map(res => res.json());
    }

    changePassword(data) {
        return this.http.post(
            environment.apiUrl + '/user/auth/changepassword',
            data,
            this.createAuthenticationHeaders()
        ).map(res => res.json())
    }

}
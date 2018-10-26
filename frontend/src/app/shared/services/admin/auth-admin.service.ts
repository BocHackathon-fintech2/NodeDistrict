import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import 'rxjs/add/operator/map';

import { environment } from '../../../../environments/environment'

@Injectable()
export class AuthAdminService {

    constructor(
        private http: Http,
        public jwtHelper: JwtHelper
    ) {}

    authToken;
    admin;

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
        this.authToken = localStorage.getItem('admin_token'); // Get token and asssign to variable to be used elsewhere
    }
    
    // Function to remove token from client local storage
    removeToken() {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin');
        this.authToken = null;
        this.admin = null;
    }

    // Function to login user
    login(admin) {
        return this.http.post(environment.apiUrl + '/admin/auth/login', admin).map(res => res.json());
    }

    // Function to store user's data in client local storage
    storeUserData(admin_token, admin, done) {
        localStorage.setItem('admin_token', admin_token); // Set token in local storage
        localStorage.setItem('admin', JSON.stringify(admin)); // Set user in local storage as string
        this.authToken = admin_token; // Assign token to be used elsewhere
        this.admin = admin; // Set user to be used elsewhere
        done(null,true);
    }
}
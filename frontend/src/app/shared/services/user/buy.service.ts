import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import 'rxjs/add/operator/map';

import { AuthUserService } from './auth-user.service'
import { environment } from '../../../../environments/environment'

@Injectable()
export class UserBuyService {
    constructor(
        private authUserService: AuthUserService,
        private http: Http,
        public jwtHelper: JwtHelper
    ) {}

    get() {
        return this.http.get(
            environment.apiUrl + '/user/buy',
            this.authUserService.createAuthenticationHeaders()
        ).map(res => res.json());
    }

    save(data) {
        return this.http.post(
            environment.apiUrl + `/user/buy/post`,
            data,
            this.authUserService.createAuthenticationHeaders()
        ).map(res => res.json())
    }

};
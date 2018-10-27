import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthUserService } from '../services/user/auth-user.service';
import { JwtHelper } from 'angular2-jwt';
@Injectable()
export class AuthUserGuardService implements CanActivate {
    public isLoggedIn: boolean = false;
    private token = null;
    private user = null;
    constructor(
        public jwtHelper: JwtHelper,
        private auth: AuthUserService,
        private router: Router) {
    }

    canActivate(router: ActivatedRouteSnapshot,state: RouterStateSnapshot ):boolean {
        this.token = localStorage.getItem('user_token')
        this.user = localStorage.getItem('user');
        if(!this.checkLogin()) {
            this.router.navigate(['user/auth/login']);
            return false;
        }
        else {
           if(!this.checkActive()) {
                this.router.navigate(['user/auth/login']);
                return false;
           }
           else
               return true;
        }
    }

    checkLogin():boolean {
        if(this.isLoggedIn)
            return true;   
        else {
            this.isLoggedIn = false
            if(this.token) {
                if(!this.jwtHelper.isTokenExpired(this.token)) {
                    this.isLoggedIn = true;
                    return true;
                }
                else
                    return false;
            }
            else
                return false;
        }
    }

    checkActive():boolean {
        if(this.user){
            var json_user = JSON.parse(this.user);
            if(json_user.is_verified)
                return true;
            else
                return false;
        }
        else
            return false;
    }

}
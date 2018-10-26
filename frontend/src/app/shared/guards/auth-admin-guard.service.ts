import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthAdminService } from '../services/admin/auth-admin.service';
import { JwtHelper } from 'angular2-jwt';
@Injectable()
export class AuthAdminGuardService implements CanActivate {
    public isLoggedIn: boolean = false;
    private token = null;
    private admin = null;
    constructor(
        public jwtHelper: JwtHelper,
        private auth: AuthAdminService,
        private router: Router) {
        
    }

    canActivate(router: ActivatedRouteSnapshot,state: RouterStateSnapshot ):boolean {
        this.token = localStorage.getItem('admin_token')
        this.admin = localStorage.getItem('admin');
        if(!this.checkLogin()) {
            this.router.navigate(['auth/login']);
            return false;
        }
        else {
           if(!this.checkActive()) {
                this.router.navigate(['auth/login']);
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
        if(this.admin){
            var json_admin = JSON.parse(this.admin);
            if(json_admin.is_active)
                return true;
            else
                return false;
        }
        else
            return false;
    }

}
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import 'rxjs/add/operator/map';

import { AuthAdminService } from './auth-admin.service'
import { environment } from '../../../../environments/environment'

import { FileUploader } from 'ng2-file-upload';

@Injectable()
export class NodesService {
    constructor(
        private authAdminService: AuthAdminService,
        private http: Http,
        public jwtHelper: JwtHelper
    ) {}

    get() {
        return this.http.get(
            environment.apiUrl + '/admin/nodes',
            this.authAdminService.createAuthenticationHeaders()
        ).map(res => res.json());
    }

    view(id) {
        return this.http.get(
            environment.apiUrl + `/admin/nodes/view/${id}`,
            this.authAdminService.createAuthenticationHeaders()
        ).map(res => res.json());
    }

    add() {
        return this.http.get(
            environment.apiUrl + `/admin/nodes/add/`,
            this.authAdminService.createAuthenticationHeaders()
        ).map(res => res.json());
    }

    saveAdd(data) {
        return this.http.post(
            environment.apiUrl + `/admin/nodes/add/`,
            data,
            this.authAdminService.createAuthenticationHeaders()
        ).map(res => res.json());
    }

    edit(id) {
        return this.http.get(
            environment.apiUrl + `/admin/nodes/edit/${id}`,
            this.authAdminService.createAuthenticationHeaders()
        ).map(res => res.json());
    }

    saveEdit(data) {
        return this.http.post(
            environment.apiUrl + `/admin/nodes/edit/`,
            data,
            this.authAdminService.createAuthenticationHeaders()
        ).map(res => res.json())
    }

    deploy(id) {
        return this.http.post(
            environment.apiUrl + `/admin/nodes/deploy`,
            {id: id},
            this.authAdminService.createAuthenticationHeaders()
        ).map(res => res.json());
    }
};
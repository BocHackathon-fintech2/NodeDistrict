import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { JwtHelper } from 'angular2-jwt';

import { FileUploadModule } from 'ng2-file-upload';

import { AdminRoutingModule } from './admin.routing'

// import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { AdminComponent } from './admin.component'

import {
    AuthAdminService,
    AuthAdminGuardService,
    AdminUsersService,
    TokensService
} from '../shared/index'

import {
    AuthComponent,
    AdminLoginComponent
} from './auth/index'

import * as dashboard from './dashboard/index'

import { BrowserXhr } from '@angular/http';

@NgModule({
    declarations: [
        AdminComponent,
        AuthComponent,
        AdminLoginComponent,
        dashboard.AdminDashboardComponent,
        dashboard.AdminNavigationSidebarComponent,
        dashboard.AdminNavigationHeaderComponent,

        dashboard.AdminUsersComponent,
        dashboard.AdminUsersAddComponent,
        dashboard.AdminUsersViewComponent,
        dashboard.AdminUsersEditComponent,

        dashboard.TokensComponent,
        dashboard.TokensAddComponent,
        dashboard.TokensViewComponent,
        dashboard.TokensEditComponent

    ],
    imports: [
        // Ng2SearchPipeModule,
        CommonModule, 
        ReactiveFormsModule,
        FormsModule, 
        HttpModule,
        FileUploadModule,
        AdminRoutingModule
    ],
    providers: [
        JwtHelper,
        AuthAdminGuardService,
        AuthAdminService,
        AdminUsersService,
        TokensService
    ],
    bootstrap: [AdminComponent]
})
export class AdminModule { }
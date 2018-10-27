import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { JwtHelper } from 'angular2-jwt';

import { FileUploadModule } from 'ng2-file-upload';

import { UserRoutingModule } from './user.routing'

import { UserComponent } from './user.component'

import { BrowserXhr } from '@angular/http';
import {CustExtBrowserXhr} from '../cust-ext-browser-xhr';
import { CookieService, CookieOptions } from 'angular2-cookie/core';
import {NgxPaginationModule} from 'ngx-pagination';

import {
    AuthUserService,
    AuthUserGuardService,
    UserHomeService,
    UserBuyService
} from '../shared/index'

import {
    UserAuthComponent,
    UserLoginComponent
} from './auth/index'

import * as dashboard from './dashboard/index'

@NgModule({
    declarations: [
        UserComponent,
        UserAuthComponent,
        UserLoginComponent,
        dashboard.UserFooterComponent,

        dashboard.UserDashboardComponent,
        dashboard.UserNavigationSidebarComponent,
        dashboard.UserNavigationHeaderComponent,

        dashboard.UserHomeComponent
    ],
    imports: [
        CommonModule, 
        ReactiveFormsModule,
        FormsModule, 
        HttpModule,
        FileUploadModule,
        UserRoutingModule,
        NgxPaginationModule
    ],
    providers: [
        {provide: BrowserXhr, useClass:CustExtBrowserXhr},
        JwtHelper,
        AuthUserGuardService,
        AuthUserService,
        UserHomeService,
        UserBuyService,
        CookieService,
        { provide: CookieOptions, useValue: {} },
    ],
    bootstrap: [UserComponent]
})
export class UserModule { }
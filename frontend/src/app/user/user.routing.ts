import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthUserGuardService } from '../shared/guards/auth-user-guard.service'
import {
    UserAuthComponent,
    UserLoginComponent
} from './auth/index'

import * as dashboard from './dashboard/index'

const routes: Routes = [
    {
        path: 'auth',
        component: UserAuthComponent,
        children: [
            {
                path: 'login',
                component: UserLoginComponent
            }
        ]
    },
    {
        path:'',
        component: dashboard.UserDashboardComponent,
        canActivate: [AuthUserGuardService],
        children: [
            {
                path: 'home',
                component: dashboard.UserHomeComponent
            }
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }
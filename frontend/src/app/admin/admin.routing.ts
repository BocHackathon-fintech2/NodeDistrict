import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthAdminGuardService } from '../shared/guards/auth-admin-guard.service'

import {
    AuthComponent,
    AdminLoginComponent
} from './auth/index'

import * as dashboard from './dashboard/index'

const routes: Routes = [
    {
        path: 'auth',
        component: AuthComponent,
        children: [
            {
                path: 'login',
                component: AdminLoginComponent,
            },
        ]
    },
    {
        path:'',
        component: dashboard.AdminDashboardComponent,
        canActivate: [AuthAdminGuardService],
        children: [
            {
                path: 'admins',
                component: dashboard.AdminUsersComponent
            },
            {
                path: 'admins/add',
                component: dashboard.AdminUsersAddComponent
            },
            {
                path: 'admins/view/:id',
                component: dashboard.AdminUsersViewComponent
            },
            {
                path: 'admins/edit/:id',
                component: dashboard.AdminUsersEditComponent
            },
            {
                path: 'tokens',
                component: dashboard.TokensComponent
            },
            {
                path: 'tokens/add',
                component: dashboard.TokensAddComponent
            },
            {
                path: 'tokens/view/:id',
                component: dashboard.TokensViewComponent
            },
            {
                path: 'tokens/edit/:id',
                component: dashboard.TokensEditComponent
            },
            {
                path: 'nodes',
                component: dashboard.NodesComponent
            },
            {
                path: 'nodes/add',
                component: dashboard.NodesAddComponent
            },
            {
                path: 'nodes/view/:id',
                component: dashboard.NodesViewComponent
            },
            {
                path: 'nodes/edit/:id',
                component: dashboard.NodesEditComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
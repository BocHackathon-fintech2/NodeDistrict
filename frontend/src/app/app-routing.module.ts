import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';

import { PreloadAllModules, Routes, RouterModule } from '@angular/router';
const routes: Routes = [
    {
        path: 'user',
        loadChildren: 'app/user/user.module#UserModule'

    },
    {
        path: 'admin',
        loadChildren: 'app/admin/admin.module#AdminModule'
    }
]


@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules
        })
    ],
    exports: [
        RouterModule,
    ]
})
export class AppRoutingModule { }

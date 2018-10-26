import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AdminUsersService } from '../../../shared/services/admin/admin-users.service'

import { dataTableConfig } from '../../../app.helpers';

@Component({
    selector: 'admin-users-route',
    templateUrl: './admin-users.component.html'
})


export class AdminUsersComponent implements OnInit {
    array = [];
    constructor(  
        private service: AdminUsersService,
        private router: Router
    ){}

    ngOnInit() {
        this.get();
    }

    get() {
        this.service.get().subscribe(data => {
            this.array = data;
            dataTableConfig();
        }, (err) => {
            console.log(err._body)
        })
    }
}
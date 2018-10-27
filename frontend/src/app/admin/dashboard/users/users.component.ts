import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UsersService } from '../../../shared/services/admin/users.service'

import { dataTableConfig } from '../../../app.helpers';

@Component({
    selector: 'users-route',
    templateUrl: './users.component.html'
})


export class UsersComponent implements OnInit {
    array = [];
    constructor(  
        private service: UsersService,
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
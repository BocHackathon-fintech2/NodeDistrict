import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TokensService } from '../../../shared/services/admin/tokens.service'

import { dataTableConfig } from '../../../app.helpers';

@Component({
    selector: 'tokens-route',
    templateUrl: './tokens.component.html'
})


export class TokensComponent implements OnInit {
    array = [];
    constructor(  
        private service: TokensService,
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
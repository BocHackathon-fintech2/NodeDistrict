import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NodesService } from '../../../shared/services/admin/nodes.service'

import { dataTableConfig } from '../../../app.helpers';

@Component({
    selector: 'nodes-route',
    templateUrl: './nodes.component.html'
})


export class NodesComponent implements OnInit {
    array = [];
    constructor(  
        private service: NodesService,
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
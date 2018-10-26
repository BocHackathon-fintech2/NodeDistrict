import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import { TokensService } from '../../../../shared/services/admin/tokens.service'
import { environment } from '../../../../../environments/environment'

@Component({
    selector: 'tokens-view-route',
    templateUrl: './view.component.html'
})


export class TokensViewComponent implements OnInit {
    obj = {};
    apiUrl = environment.apiUrl+"/";
    have_error = false;
    message;
    constructor(  
        private service: TokensService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ){}

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            let id = params['id'];
            this.view(id);
        });
    }

    view(id) {
        this.service.view(id).subscribe(data => {
            this.obj = data;
            console.log(this.obj);
        }, (err) => {
            console.log(err._body)
        })
    }

    deleteMethod(id) {
        if(confirm("Are you sure you wish to delete this entry? ")) {
            this.service.delete(id).subscribe(data => {
                this.router.navigate([`/admin/tokens/`])                
            }, (err) => {
                this.have_error = true;
                this.message = err._body;
            })
        }
    }
}
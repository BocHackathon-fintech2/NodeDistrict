import { Component } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import { UsersService } from '../../../../shared/services/admin/users.service'

@Component({
    selector: 'users-view-route',
    templateUrl: './view.component.html'
})


export class UsersViewComponent {
    public obj;
    have_error = false;
    message;
    constructor(  
        private service: UsersService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ){
        this.activatedRoute.params.subscribe((params: Params) => {
            let id = params['id'];
            this.view(id);
        });
        
    }

    view(id) {
        this.service.view(id).subscribe(data => {
            this.obj = data;
        }, (err) => {
            console.log(err._body)
        })
    }

    deleteMethod(id) {
        if(confirm("Are you sure you wish to delete this entry? ")) {
            this.service.delete(id).subscribe(data => {
                this.router.navigate([`/users/`])                
            }, (err) => {
                this.have_error = true;
                this.message = err._body;
            })
        }
    }
    
}
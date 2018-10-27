import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import { NodesService } from '../../../../shared/services/admin/nodes.service'
import { environment } from '../../../../../environments/environment'

declare var jQuery:any;
declare var $:any;
@Component({
    selector: 'nodes-view-route',
    templateUrl: './view.component.html'
})

export class NodesViewComponent implements OnInit {
    obj;
    apiUrl = environment.apiUrl+"/";
    have_error = false;
    message;
    users_own_node = []
    process = false;
    constructor(  
        private service: NodesService,
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
            if(data.users_own_nodes.length > 0) {
                for(var i=0; i < data.users_own_nodes.length; i++) {
                    if(this.users_own_node.length > 0) {
                        for(var c=0; c < this.users_own_node.length; c++) {
                            if( this.users_own_node[c].user_id == data.users_own_nodes[i].user_id) {
                                this.users_own_node[c]["amount_own"] += data.users_own_nodes[i].amount
                            }
                        }
                    }
                    else {
                        this.users_own_node.push({
                            user_id: data.users_own_nodes[i].user_id,
                            full_name: `${data.users_own_nodes[i].first_name} ${data.users_own_nodes[i].last_name}`,
                            amount_own: data.users_own_nodes[i].amount,
                            available_daily_amount: 0,
                            withdrawl_daily_amount: 0,
                            total_daily_amount: 0
                        })
                    }
                }
            }
            if(this.users_own_node.length > 0) {
                if(data.users_nodes_rewards.length > 0) {
                    for(var i=0; i < data.users_nodes_rewards.length; i++) {
                        for(var c=0; c < this.users_own_node.length; c++) {
                            if(this.users_own_node[c].user_id == data.users_nodes_rewards[i].user_id) {
                                if(!data.users_nodes_rewards[i].withdrawl_at)
                                    this.users_own_node[c]["available_daily_amount"] += data.users_nodes_rewards[i].amount
                                else if(data.users_nodes_rewards[i].withdrawl_at)
                                    this.users_own_node[c]["withdrawl_daily_amount"] +=  data.users_nodes_rewards[i].amount
   
                                this.users_own_node[c]["total_daily_amount"] += data.users_nodes_rewards[i].amount
                            }
                        }
                    }
                }
            }
        }, (err) => {
            console.log(err._body)
        })
    }

    deleteMethod(id) {
        if(confirm("Are you sure you wish to delete this entry? ")) {
            this.service.delete(id).subscribe(data => {
                this.router.navigate([`/admin/nodes/`])                
            }, (err) => {
                this.have_error = true;
                this.message = err._body;
            })
        }
    }

    deployMethod(id) {
        this.process = true;
        this.service.deploy(id).subscribe(data => {
            location.reload();
            this.process = false;
        }, (err) => {
            this.process = false;
            this.have_error = true;
            this.message = err._body;
        })
    }

    destroyMethod(id) {
        this.process = true;
        this.service.destroy(id).subscribe(data => {
            location.reload();
            this.process = false;
        }, (err) => {
            this.process = false;
            this.have_error = true;
            this.message = err._body;
        })
    }

}

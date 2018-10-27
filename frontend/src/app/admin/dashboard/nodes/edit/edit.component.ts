import { Component, OnInit, AfterViewInit } from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms'
import { FileUploader } from 'ng2-file-upload';
import { NodesService } from '../../../../shared/services/admin/nodes.service'
import { environment } from '../../../../../environments/environment'

declare var jQuery:any;
@Component({
    selector: 'nodes-edit-route',
    templateUrl: './edit.component.html'
})


export class NodesEditComponent implements OnInit{
    form: FormGroup;
    id;
    obj = {};
    apiUrl = environment.apiUrl+"/";
    processing = false;
    have_error = false;
    message;
    constructor(  
        private formBuilder: FormBuilder,
        private _location: Location,
        private service: NodesService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ){
        this.activatedRoute.params.subscribe((params: Params) => {
            this.id = params['id'];
            this.edit(this.id);
        });
        
    }

    backClicked() {
        this._location.back();
    }

    ngOnInit() {
        this.createForm();
    }

    ngAfterViewInit() {
        
    }

    createForm() {
        this.form = this.formBuilder.group({
            title: ['', Validators.compose([
                Validators.required,
            ])],
            token_id: ['', Validators.compose([
                Validators.required
            ])],
            total_tokens: ['', Validators.compose([
                Validators.required
            ])],
            daily_rewards: ['', Validators.compose([
                Validators.required
            ])]
            
        });
    };

    disableForm() {
        this.form.controls['title'].disable();
        this.form.controls['token_id'].disable();
        this.form.controls['total_tokens'].disable();
        this.form.controls['daily_rewards'].disable();
    }

    enableForm() {
        this.form.controls['title'].enable();
        this.form.controls['token_id'].enable();
        this.form.controls['total_tokens'].enable();
        this.form.controls['daily_rewards'].enable();
    }
   
    edit(id) {
        this.service.edit(id).subscribe(data => {
            this.obj = data;
            console.log(this.obj)
            this.form.controls['title'].setValue(data.node.title);
            this.form.controls['token_id'].setValue(data.node.token_id)
            this.form.controls['total_tokens'].setValue(data.node.total_tokens);
            this.form.controls['daily_rewards'].setValue(data.node.daily_rewards);
        }, (err) => {
            this.have_error = true;
            this.message = err._body;
        })
    }

    onSaveSubmit() {
        this.have_error = false;
        this.processing = true;
        this.disableForm();
        this.service.saveEdit({
            id: this.id,
            title : this.form.get('title').value,
            token_id : this.form.get('token_id').value,
            total_tokens: this.form.get('total_tokens').value,
            daily_rewards: this.form.get('daily_rewards').value,
        }).subscribe(res => {
            this.router.navigate([`/admin/nodes/view/${this.id}`])
        }, (err) => {
            this.have_error = true;
            this.message = err._body;
            this.processing = false;
            this.enableForm();
        })
    }
}
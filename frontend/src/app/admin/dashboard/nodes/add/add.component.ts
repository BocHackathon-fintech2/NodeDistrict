import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms'

import { FileUploader } from 'ng2-file-upload';
import { NodesService } from '../../../../shared/services/admin/nodes.service'

import { environment } from '../../../../../environments/environment'

declare var jQuery:any;
@Component({
    selector: 'nodes-add-route',
    templateUrl: './add.component.html'
})


export class NodesAddComponent implements OnInit{
    form: FormGroup;
    processing = false;
    have_error = false;
    message;
    obj = {};
    constructor(  
        private formBuilder: FormBuilder,
        private _location: Location,
        private service: NodesService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ){}

    backClicked() {
        this._location.back();
    }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.form = this.formBuilder.group({
            title: ['', Validators.compose([
                Validators.required
            ])],
            token_id: ['', Validators.compose([
                Validators.required
            ])],
            available_tokens: ['', Validators.compose([
                Validators.required
            ])],
            daily_tokens: ['', Validators.compose([
                Validators.required
            ])],
            total_tokens: ['', Validators.compose([
                Validators.required
            ])],
        });
    };

    disableForm() {
        this.form.controls['title'].disable();
        this.form.controls['token_id'].disable();
        this.form.controls['available_tokens'].disable();
        this.form.controls['total_tokens'].disable();
        this.form.controls['daily_rewards'].disable();
        this.form.controls['total_rewards'].disable();
    }

    enableForm() {
        this.form.controls['title'].enable();
        this.form.controls['token_id'].enable();
        this.form.controls['available_tokens'].enable();
        this.form.controls['total_tokens'].enable();
        this.form.controls['daily_rewards'].enable();
        this.form.controls['total_rewards'].enable();
    }

    get() {
        this.service.add().subscribe(data => {
            this.obj = data;
          }, (err) => {
            this.have_error = true;
            this.message = err._body;
            this.processing = false;
            this.enableForm();
        })
    }

    onSaveSubmit() {
        this.have_error = false;
        this.processing = true;
        this.disableForm();

        this.service.saveAdd({
            title : this.form.get('title').value,
            token_id: this.form.get('token_id'),
            available_tokens: this.form.get('available_tokens'),
            total_tokens: this.form.get('total_tokens'),
            daily_rewards: this.form.get('daily_rewards'),
            total_rewards: this.form.get('total_rewards')
        }).subscribe(res => {
            this.router.navigate([`/admin/tokens/view/${res.id}`])
        }, (err) => {
            this.have_error = true;
            this.message = err._body;
            this.processing = false;
            this.enableForm();
        })
    }

}
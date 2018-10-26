import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms'

import { FileUploader } from 'ng2-file-upload';
import { TokensService } from '../../../../shared/services/admin/tokens.service'

import { environment } from '../../../../../environments/environment'

declare var jQuery:any;
@Component({
    selector: 'tokens-add-route',
    templateUrl: './add.component.html'
})


export class TokensAddComponent implements OnInit{
    form: FormGroup;
    processing = false;
    have_error = false;
    message;
    obj = {};
    constructor(  
        private formBuilder: FormBuilder,
        private _location: Location,
        private service: TokensService,
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
                Validators.required,
                Validators.maxLength(200)
            ])],
            symbol: ['', Validators.compose([
                Validators.required
            ])],
            price: ['', Validators.compose([
                Validators.required
            ])],
        });
    };

    disableForm() {
        this.form.controls['title'].disable();
        this.form.controls['symbol'].disable();
        this.form.controls['price'].disable();
    }

    enableForm() {
        this.form.controls['title'].enable();
        this.form.controls['symbol'].enable();
        this.form.controls['price'].enable();
    }

    onSaveSubmit() {
        this.have_error = false;
        this.processing = true;
        this.disableForm();

        this.service.saveAdd({
            title : this.form.get('title').value,
            symbol: this.form.get('symbol').value,
            price: this.form.get('price').value,
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
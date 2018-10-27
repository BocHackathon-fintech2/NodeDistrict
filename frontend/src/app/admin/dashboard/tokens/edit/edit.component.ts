import { Component, OnInit, AfterViewInit } from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms'
import { FileUploader } from 'ng2-file-upload';
import { TokensService } from '../../../../shared/services/admin/tokens.service'
import { environment } from '../../../../../environments/environment'

declare var jQuery:any;
@Component({
    selector: 'tokens-edit-route',
    templateUrl: './edit.component.html'
})


export class TokensEditComponent implements OnInit{
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
        private service: TokensService,
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
   
    edit(id) {
        this.service.edit(id).subscribe(data => {
            this.obj = data;
            this.form.controls['title'].setValue(data.title);
            this.form.controls['symbol'].setValue(data.symbol);
            this.form.controls['price'].setValue(data.price);

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
            symbol : this.form.get('symbol').value,
            price: this.form.get('price').value
        }).subscribe(res => {
            this.router.navigate([`/admin/tokens/view/${this.id}`])
        }, (err) => {
            this.have_error = true;
            this.message = err._body;
            this.processing = false;
            this.enableForm();
        })
    }
}
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import {Observable } from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
@Injectable()
export class LocalStorageInjectableService {
    private storageSub= new Subject<boolean>();

    watchStorage(): Observable<any> {
      return this.storageSub.asObservable();
    }
  
    setItem(key: string, data: any) {
      localStorage.setItem(key, data);
      this.storageSub.next(true);
    }
  
    removeItem(key) {
      localStorage.removeItem(key);
      this.storageSub.next(true);
    }
  }
  
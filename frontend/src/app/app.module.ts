import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserXhr, HttpModule } from '@angular/http';
import {CustExtBrowserXhr} from './cust-ext-browser-xhr';

import { GoogleAnalyticsEventsService } from './shared/injectable/google-analytics-events.service'
import { CookieService, CookieOptions } from 'angular2-cookie/core';

export function cookieServiceFactory(options: CookieOptions) {
  return new CookieService(options);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
  {provide: BrowserXhr, useClass:CustExtBrowserXhr},
  CookieService,
  { provide: CookieOptions, useValue: {} },
  GoogleAnalyticsEventsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
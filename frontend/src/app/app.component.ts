import { Component, AfterViewInit } from '@angular/core';
import { 
    Router, NavigationStart, NavigationCancel, NavigationEnd 
} from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

declare const ga: Function;
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {
    loading;
    constructor(
        private router: Router,
        private title: Title,
        private meta: Meta
    ) {

        this.loading = true;
    }
    ngAfterViewInit() {
    }
}
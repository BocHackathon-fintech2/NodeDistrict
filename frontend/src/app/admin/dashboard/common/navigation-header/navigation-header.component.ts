import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { smoothlyMenu } from '../../../../app.helpers';
declare var jQuery:any;

@Component({
    selector: 'navigation-header',
    templateUrl: './navigation-header.component.html'
})

export class AdminNavigationHeaderComponent {
    constructor() {
        jQuery("body").addClass("body-small pace-done")
    }
    toggleNavigation(): void {
        jQuery("body").toggleClass("mini-navbar");
        smoothlyMenu();
      }

}
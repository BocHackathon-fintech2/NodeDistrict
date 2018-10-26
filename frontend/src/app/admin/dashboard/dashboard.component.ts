import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AdminNavigationSidebarComponent } from './common/navigation-sidebar/navigation-sidebar.component'
import { AdminNavigationHeaderComponent } from './common/navigation-header/navigation-header.component'

@Component({
    selector: 'admin-dashboard',
    templateUrl: './dashboard.component.html',
})

@ViewChild(AdminNavigationSidebarComponent)
@ViewChild(AdminNavigationHeaderComponent)

export class AdminDashboardComponent {
}
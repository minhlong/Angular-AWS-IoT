import { Routes } from '@angular/router';

import { BasicComponent } from './modules/layouts/basic.component';
import { BlankComponent } from './modules/layouts/blank.component';

import { AuthGuard } from './services/guards/auth-guard.service';
import { GuestGuard } from './services/guards/guest-guard.service';

import { LogoutComponent } from './components/logout.component';
import { LoginComponent } from './components/login/login.component';
import { MainViewComponent } from './components/main-view/main-view.component';
import { DeviceManagementComponent } from './components/device-management/device-management.component';

const noAuth: Routes = [
    {
        path: '', component: BlankComponent,
        children: [
            { path: 'login', component: LoginComponent },
        ],
        canActivateChild: [GuestGuard]
    },
];

const hasAuth: Routes = [
    {
        path: '', component: BasicComponent,
        children: [
            { path: 'home', component: MainViewComponent },
            { path: 'device-management', component: DeviceManagementComponent },
            { path: 'logout', component: LogoutComponent }
        ],
        canActivateChild: [AuthGuard]
    },
];

export const ROUTES: Routes = [
    // Main redirect
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    // App views
    ...noAuth,
    ...hasAuth,

    // Handle all other routes
    { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

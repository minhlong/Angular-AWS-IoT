import { Routes } from '@angular/router';

import { BasicComponent } from './modules/layouts/basic.component';
import { BlankComponent } from './modules/layouts/blank.component';
import { LogoutComponent } from './components/logout.component';
import { LoginComponent } from './components/login/login.component';
import { MainViewComponent } from './components/main-view/main-view.component';

const noAuth: Routes = [
    {
        path: '', component: BlankComponent,
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'logout', component: LogoutComponent }
        ]
    },
];

const hasAuth: Routes = [
    {
        path: '', component: BasicComponent,
        children: [
            { path: 'home', component: MainViewComponent }
        ]
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

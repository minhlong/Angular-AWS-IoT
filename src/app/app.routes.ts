import { loginComponent } from './modules/login/login.component';
import { Routes } from "@angular/router";
import { mainViewComponent } from './modules/main-view/main-view.component';
import { basicComponent } from './modules/layouts/basic.component';
import { blankComponent } from './modules/layouts/blank.component';

const noAuth: Routes = [
    {
        path: '', component: blankComponent,
        children: [
            { path: 'login', component: loginComponent }
        ]
    },
];

const hasAuth: Routes = [
    {
        path: '', component: basicComponent,
        children: [
            { path: 'home', component: mainViewComponent }
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
    { path: '**', component: mainViewComponent }
];

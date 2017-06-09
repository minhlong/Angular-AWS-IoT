import { loginComponent } from './modules/login/login.component';
import { Routes } from "@angular/router";
import { mainViewComponent } from './modules/main-view/main-view.component';
import { basicComponent } from './modules/layouts/basic.component';
import { blankComponent } from './modules/layouts/blank.component';

export const ROUTES: Routes = [
    // Main redirect
    { path: '', redirectTo: 'mainView', pathMatch: 'full' },

    // App views
    {
        path: '', component: basicComponent,
        children: [
            { path: 'mainView', component: mainViewComponent },
        ]
    },
    {
        path: '', component: blankComponent,
        children: [
            { path: 'login', component: loginComponent },
        ]
    },

    // Handle all other routes
    { path: '**', component: mainViewComponent }
];

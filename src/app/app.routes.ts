import { Routes } from '@angular/router';

import { BasicComponent } from './modules/layouts/basic.component';
import { BlankComponent } from './modules/layouts/blank.component';

import { AuthGuard } from './services/guards/auth-guard.service';
import { GuestGuard } from './services/guards/guest-guard.service';

import { LogoutComponent } from './components/logout.component';
import { LoginComponent } from './components/login/login.component';
import { MainViewComponent } from './components/main-view/main-view.component';
import { DeviceDetailComponent } from './components/device-detail/device-detail.component';
import { ApiComponent } from './components/api/api.component';
import { IotThingInfoComponent } from './components/iot-thing-info/iot-thing-info.component';
import { IotProtocolComponent } from './components/iot-protocol/iot-protocol.component';
import { IotFlowComponent } from './components/iot-flow/iot-flow.component';
import { IotEmulatorComponent } from './components/iot-emulator/iot-emulator.component';

const noAuth: Routes = [
    {
        path: '', component: BlankComponent,
        children: [
            { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
            { path: 'iot-emulator', component: IotEmulatorComponent, canActivate: [AuthGuard] },
        ],

    },
];

const hasAuth: Routes = [
    {
        path: '', component: BasicComponent,
        children: [
            { path: 'home', component: MainViewComponent },
            { path: 'api', component: ApiComponent },
            { path: 'iot-protocol', component: IotProtocolComponent },
            { path: 'iot-thing-info', component: IotThingInfoComponent },
            { path: 'iot-flow', component: IotFlowComponent },
            { path: 'device-detail', component: DeviceDetailComponent },
            { path: 'logout', component: LogoutComponent },
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

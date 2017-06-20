/** Khai các service provider */
import { Store } from '@ngrx/store';
import { Http } from '@angular/http';

import { AuthActions } from '../store/actions/auth.action';

import { GuestGuard } from './guards/guest-guard.service';
import { AuthGuard } from './guards/auth-guard.service';
import { MQTTService } from './mqtt.service';
import { AuthCognitoService } from './auth-cognito.service';
import { JwtAuthHttp, authFactory } from './http-auth.service';

export function providers() {
  return [
    AuthCognitoService,
    AuthGuard,
    MQTTService,
    GuestGuard,
    {
      provide: JwtAuthHttp,
      useFactory: authFactory,
      deps: [Http, AuthActions, Store]
    }
  ];
}

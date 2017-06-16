/** Khai các service provider */
import { AuthCognitoService } from './auth-cognito.service';
import { Store } from '@ngrx/store';
import { Http } from '@angular/http';
import { JwtAuthHttp, authFactory } from './http-auth.service';
import { AuthActions } from '../store/actions/auth.action';
import { GuestGuard } from './guards/guest-guard.service';
import { AuthGuard } from './guards/auth-guard.service';

export function providers() {
  return [
    AuthCognitoService,
    AuthGuard,
    GuestGuard,
    {
      provide: JwtAuthHttp,
      useFactory: authFactory,
      deps: [Http, AuthActions, Store]
    }
  ];
}

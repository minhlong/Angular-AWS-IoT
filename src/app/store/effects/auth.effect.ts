/**
 * Auth Middle Ware
 * Các method được gọi trong khi store được cập nhật
 */
import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { AuthActions } from '../actions/auth.action';
import { AuthCognitoService } from '../../services/auth-cognito.service';

import 'rxjs/Rx';

@Injectable()
export class AuthEffect {

  constructor(
    private router: Router,
    private actions$: Actions,
    private cogAuthService: AuthCognitoService,
    private authActions: AuthActions
  ) {
  }

  @Effect()
  login$: Observable<Action> = this.actions$
    .ofType(AuthActions.AUTH)
    .map<Action, any>(toPayload)
    .switchMap((payload: any) => this.cogAuthService.authenticate(payload.email, payload.password)
      .map((user: any) => this.authActions.authCompleted(user))
      .do(() => {
        this.router.navigate(['/home']);
      })
      .catch((err) =>
        Observable.of(this.authActions.authError(err))
      )
    );

  @Effect()
  getLoggedUser$: Observable<Action> = this.actions$
    .ofType(AuthActions.GET_LOGGED_USER)
    .map(() => {
      const usr = this.cogAuthService.getLoggedUser(localStorage.getItem('token'));
      return this.authActions.getLoggedUserSucc(usr);
    });

  @Effect()
  logout$: Observable<Action> = this.actions$
    .ofType(AuthActions.LOGOUT, AuthActions.UNAUTHORIZED)
    .do(() => {
      this.cogAuthService.logout();
      this.router.navigate(['/login']);
    })
    .map(() => this.authActions.logoutSuccess())
    .catch((err) =>
      Observable.of(this.authActions.authError(err))
    );
}

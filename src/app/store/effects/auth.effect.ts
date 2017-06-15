/**
 * Auth Middle Ware
 * Các method được gọi trong khi store được cập nhật
 */
import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { AuthActions } from '../actions/auth.action';
import { AuthProvider } from '../../services/auth.provider';

import 'rxjs/Rx';

@Injectable()
export class AuthEffect {

  constructor(
    private actions$: Actions,
    private authService: AuthProvider, // Auth Service xử lý các thao tác với server
    private authActions: AuthActions // Định nghĩa các Auth action
  ) {
  }

  // tslint:disable-next-line:member-ordering
  @Effect()
  login$: Observable<Action> = this.actions$
    .ofType(AuthActions.AUTH)
    .map<Action, any>(toPayload)
    .switchMap((payload: any) => this.authService.login(payload.username, payload.password)
      .map((user: any) => this.authActions.authCompleted(user))
      .catch((err) =>
        Observable.of(this.authActions.authError(err))
      )
    );

  // tslint:disable-next-line:member-ordering
  @Effect()
  checkToken$: Observable<Action> = this.actions$
    .ofType(AuthActions.CHECK_TOKEN)
    .switchMap(() => this.authService.getLoggedUser()
      .map((user: any) => {
        return this.authActions.checkTokenCompleted(user);
      })
      .catch((err) =>
        Observable.of(this.authActions.checkTokenCompleted(null))
      )
    );

  // tslint:disable-next-line:member-ordering
  @Effect()
  logout$: Observable<Action> = this.actions$
    .ofType(AuthActions.LOGOUT, AuthActions.UNAUTHORIZED)
    .do(() => this.authService.logout())
    .map(() => this.authActions.logoutSuccess());
}

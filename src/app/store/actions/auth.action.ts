/**
 * Định nghĩa các action để cập nhập store
 */

import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

@Injectable()
export class AuthActions {

  static CHECK_TOKEN = '[Auth] Check Token';
  checkToken(): Action {
    return {
      type: AuthActions.CHECK_TOKEN
    };
  }

  static CHECK_TOKEN_COMPLETED = '[Auth] Check Token Completed';
  checkTokenCompleted(user: any = null): Action {
    return {
      type: AuthActions.CHECK_TOKEN_COMPLETED,
      payload: user
    };
  }

  static AUTH = '[Auth] Login';
  auth(username: string, password: string): Action {
    return {
      type: AuthActions.AUTH,
      payload: {
        username,
        password
      }
    };
  }

  static AUTH_COMPLETED = '[Auth] Login Completed';
  authCompleted(user: any = null): Action {
    return {
      type: AuthActions.AUTH_COMPLETED,
      payload: user
    };
  }


  static AUTH_FAILED = '[Auth] Login Failed';
  authError(err: any): Action {
    return {
      type: AuthActions.AUTH_FAILED,
      payload: err
    };
  }

  static UNAUTHORIZED = '[Auth] Unauthorized';
  unauthorized(): Action {
    return {
      type: AuthActions.UNAUTHORIZED
    };
  }

  static LOGOUT = '[Auth] Logout';
  logout(): Action {
    return {
      type: AuthActions.LOGOUT
    };
  }

  static LOGOUT_SUCCESS = '[Auth] Logout Success';
  logoutSuccess(): Action {
    return {
      type: AuthActions.LOGOUT_SUCCESS
    };
  }
}

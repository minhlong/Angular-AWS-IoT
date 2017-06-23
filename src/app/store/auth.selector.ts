import { Observable } from 'rxjs/Rx';
import { compose } from '@ngrx/core/compose';
import '@ngrx/core/add/operator/select';

import { AppState } from './reducers/index';
import { AuthState } from './reducers/auth/auth.state';

/**
 * reference : https://gist.github.com/btroncone/a6e4347326749f938510#extracting-selectors-for-reuse
 */
export class AuthSelector {

  public static getErrorMessage(): (selector: Observable<AppState>) => Observable<string> {
    return compose(this._getErrorMessage(), this.getAuthState());
  }

  public static getCurrentUser(): (selector: Observable<AppState>) => Observable<any> {
    return compose(this._getCurrentUser(), this.getAuthState());
  }

  public static isLoading(): (selector: Observable<AppState>) => Observable<boolean> {
    return compose(this._isLoading(), this.getAuthState());
  }

  private static getAuthState() {
    return (state$: Observable<AppState>) => state$.select(s => s.auth);
  }

  private static _getErrorMessage() {
    return (state$: Observable<AuthState>) => state$.select(s => s.error);
  }

  private static _getCurrentUser() {
    return (state$: Observable<AuthState>) => state$.select(s => s.currentUser);
  }

  private static _isLoading() {
    return (state$: Observable<AuthState>) => state$.select(s => s.loading);
  }
}

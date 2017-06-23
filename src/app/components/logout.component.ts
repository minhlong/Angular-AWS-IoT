import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../store/reducers/index';
import { AuthActions } from './../store/actions/auth.action';

@Component({
  selector: 'app-logout',
  template: ''
})
export class LogoutComponent {
  constructor(
    private authActions: AuthActions,
    private store: Store<AppState>
  ) {
    this.store.dispatch(this.authActions.logout());
  }
}

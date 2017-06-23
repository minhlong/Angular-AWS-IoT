import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { AuthSelector } from '../../store/auth.selector';
import { AppState } from '../../store/reducers/index';
import { AuthActions } from './../../store/actions/auth.action';

@Component({
  selector: 'app-login-component',
  templateUrl: 'login.template.html'
})
export class LoginComponent implements OnDestroy {
  login: { email?: string, password?: string } = {};
  isLoading = false;
  errorMessage: string;

  private handleLoading: Subscription;
  private handleErr: Subscription;

  constructor(
    private authActions: AuthActions,
    private store: Store<AppState>
  ) {
    this.handleLoading = this.store.let(AuthSelector.isLoading()).subscribe(res => {
      this.isLoading = res
    });

    this.handleErr = this.store.let(AuthSelector.getErrorMessage()).subscribe(err => {
      this.errorMessage = err
    });
  }

  /**
   * User submit login form
   */
  onLogin(form: NgForm) {
    if (form.valid) {
      this.store.dispatch(this.authActions.auth(this.login.email, this.login.password));
    }
  }

  ngOnDestroy() {
    this.handleLoading.unsubscribe();
    this.handleErr.unsubscribe();
  }
}

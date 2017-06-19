import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { AuthActions } from '../../../store/actions/auth.action';
import { AppState } from '../../../store/reducers/index';
import { AuthSelector } from './../../../store/auth.selector';

declare var jQuery: any;

@Component({
  selector: 'app-navigation',
  templateUrl: 'navigation.template.html'
})

export class NavigationComponent implements AfterViewInit, OnDestroy {
  private handleUserInfo: Subscription;
  userInfo = { email: null };

  constructor(
    private router: Router,
    private authActions: AuthActions,
    private store: Store<AppState>
  ) {
    // Update Init State
    this.store.dispatch(this.authActions.getLoggedUser());

    this.handleUserInfo = this.store.let(AuthSelector.getCurrentUser()).subscribe(res => {
      this.userInfo = res
    });
  }

  ngAfterViewInit() {
    jQuery('#side-menu').metisMenu();
  }

  activeRoute(routename: string): boolean {
    return this.router.url.indexOf(routename) > -1;
  }

  ngOnDestroy() {
    this.handleUserInfo.unsubscribe();
  }
}

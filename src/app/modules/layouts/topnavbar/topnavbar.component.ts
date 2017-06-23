import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { smoothlyMenu } from '../../../app.helpers';
import { AuthSelector } from '../../../store/auth.selector';
import { AppState } from '../../../store/reducers/index';

declare var jQuery: any;

@Component({
  selector: 'app-topnavbar',
  templateUrl: 'topnavbar.template.html'
})
export class TopnavbarComponent implements OnDestroy {
  private handleUserInfo: Subscription;
  userInfo = { email: null };

  constructor(
    private store: Store<AppState>
  ) {
    this.handleUserInfo = this.store.let(AuthSelector.getCurrentUser()).subscribe(res => {
      this.userInfo = res
    });
  }

  toggleNavigation(): void {
    jQuery('body').toggleClass('mini-navbar');
    smoothlyMenu();
  }

  ngOnDestroy() {
    this.handleUserInfo.unsubscribe();
  }
}

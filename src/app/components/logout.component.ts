import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoggedInCallback, UserLoginService } from './../services/cognito.service';

@Component({
  selector: 'app-logout',
  template: ''
})
export class LogoutComponent implements LoggedInCallback {

  constructor(
    public router: Router,
    public userService: UserLoginService
  ) {
    this.userService.isAuthenticated(this)
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.userService.logout();
    }

    this.router.navigate(['/login']);
  }
}

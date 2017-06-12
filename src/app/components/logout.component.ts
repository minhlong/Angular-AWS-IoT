import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedInCallback, CognitoAuthService } from './../services/cognito-auth.service';

@Component({
  selector: 'app-logout',
  template: ''
})
export class LogoutComponent implements LoggedInCallback {

  constructor(
    public router: Router,
    public authService: CognitoAuthService
  ) {
    this.authService.isAuthenticated(this)
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.authService.logout();
    }

    this.router.navigate(['/login']);
  }
}

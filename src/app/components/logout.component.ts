import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedInCallback, CognitoAuthService } from './../services/cognito-auth.service';

@Component({
  selector: 'app-logout',
  template: ''
})
export class LogoutComponent {
  constructor(
    public router: Router,
    public authService: CognitoAuthService
  ) {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

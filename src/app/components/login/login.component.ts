import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Callback, CognitoAuthService } from './../../services/cognito-auth.service';

@Component({
  selector: 'app-login-component',
  templateUrl: 'login.template.html'
})

export class LoginComponent implements OnInit, Callback {
  public email: string;
  public password: string;
  public errorMessage: string;

  constructor(
    public router: Router,
    public authService: CognitoAuthService,
  ) { }

  ngOnInit() {
    this.errorMessage = null;
    this.authService.logout();
  }

  /**
   * User submit login form
   */
  onLogin() {
    if (this.email == null || this.password == null) {
      this.errorMessage = 'All fields are required';
      return;
    }

    this.errorMessage = 'loading ...';
    this.authService.authenticate(this.email, this.password, this);
  }

  /**
   * Callback after click login for check authentication
   *
   * @param message
   * @param result
   */
  cognitoCallback(message: string, result: any) {
    if (message != null) {
      this.errorMessage = message;
    } else {
      this.router.navigate(['/home']);
    }
  }
}

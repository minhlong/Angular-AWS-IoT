import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedInCallback, CognitoAuthService } from './../../services/cognito-auth.service';

@Component({
  selector: 'app-login-component',
  templateUrl: 'login.template.html'
})

export class LoginComponent implements LoggedInCallback, OnInit {
  public email: string;
  public password: string;
  public errorMessage: string;

  constructor(
    public router: Router,
    public authService: CognitoAuthService
  ) { }

  ngOnInit() {
    this.errorMessage = null;

    // Checking if the user is already authenticated.
    // If so, then redirect to the secure site
    this.authService.isAuthenticated(this);
  }

  onLogin() {
    this.errorMessage = null;
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

  /**
   * Callback after check authentication on Init time
   *
   * @param message
   * @param isLoggedIn
   */
  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.router.navigate(['/home']);
    }
  }
}

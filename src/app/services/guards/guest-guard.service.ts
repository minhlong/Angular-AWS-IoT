import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class GuestGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
  ) {
  }

  canActivate() {
    return this.checkGuard();
  }

  canActivateChild() {
    return this.checkGuard();
  }

  private checkGuard() {
    const notAuth = !tokenNotExpired();

    if (notAuth) {
      return notAuth;
    }

    this.router.navigate(['/home']);
    return notAuth;
  }
}

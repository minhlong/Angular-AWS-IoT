import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

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
    const hasAuth = tokenNotExpired();

    if (hasAuth) {
      return hasAuth;
    }

    this.router.navigate(['/login']);
    return hasAuth;
  }
}

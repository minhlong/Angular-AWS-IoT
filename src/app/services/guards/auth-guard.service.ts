import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import { consoleLog } from '../../app.helpers';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
  ) {
  }

  canActivate() {
    consoleLog('Auth Guard: ');
    return this.checkGuard();
  }

  canActivateChild() {
    consoleLog('Auth Guard Child: ');
    return this.checkGuard();
  }

  private checkGuard() {
    const hasAuth = tokenNotExpired();
    consoleLog(hasAuth);

    if (hasAuth) {
      return hasAuth;
    }

    this.router.navigate(['/login']);
    return hasAuth;
  }
}

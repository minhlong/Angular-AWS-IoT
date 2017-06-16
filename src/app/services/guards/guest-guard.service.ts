import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import { consoleLog } from '../../app.helpers';

@Injectable()
export class GuestGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
  ) {
  }

  canActivate() {
    consoleLog('Guest Guard: ');
    return this.checkGuard();
  }

  canActivateChild() {
    consoleLog('Guest Guard Child: ');
    return this.checkGuard();
  }

  private checkGuard() {
    const notAuth = !tokenNotExpired();
    consoleLog(notAuth);

    if (notAuth) {
      return notAuth;
    }

    this.router.navigate(['/home']);
    return notAuth;
  }
}

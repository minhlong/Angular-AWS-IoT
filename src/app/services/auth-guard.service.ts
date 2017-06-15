import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  private isLogged;

  constructor(private router: Router) {
  }

  canActivate() {
    if (tokenNotExpired()) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}

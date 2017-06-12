import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { CognitoAuthService, LoggedInCallback } from './../../services/cognito-auth.service';

@Component({
  selector: 'app-main',
  templateUrl: 'main-view.template.html'
})

export class MainViewComponent implements LoggedInCallback, OnInit {
  apiURL: any = 'https://q22f35kxa7.execute-api.us-east-1.amazonaws.com/dev/locations'
  token: any
  locationData: any

  constructor(
    public router: Router,
    public authService: CognitoAuthService,
    private _http: Http
  ) {
    // Checking if the user is already authenticated.
    // If so, then redirect to the secure site
    this.authService.isAuthenticated(this);
  }

  ngOnInit() {
    const userPool = this.authService.getUserPool();
    const cognitoUser = userPool.getCurrentUser();

    cognitoUser.getSession((err, session) => {
      this.token = session.getIdToken().getJwtToken()

      this.getInfoApiUserPools(this.token).subscribe((data) => {
        this.locationData = data
      });
    });
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  getInfoApiUserPools(token): Observable<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);

    return this._http.get(this.apiURL, { headers: headers })
      .map(res => res.json())
      .catch(this._serverError);
  }

  private _serverError(err: any) {
    if (err.status === 0) {
      return Observable.throw(err.json().error || 'UNAUTHORIZED!!!');
    }
    if (err instanceof Response) {
      return Observable.throw(err.json().error || 'Backend Server Error');
    }
  }
}

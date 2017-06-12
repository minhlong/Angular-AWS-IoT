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

export class MainViewComponent implements LoggedInCallback {
    private commentsUrl;

    constructor(
        public router: Router,
        public userService: CognitoAuthService,
        private http: Http
    ) {
        // Checking if the user is already authenticated.
        // If so, then redirect to the secure site
        this.userService.isAuthenticated(this);
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate(['/login']);
        }
    }
}

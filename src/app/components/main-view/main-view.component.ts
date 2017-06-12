import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { LoggedInCallback, UserLoginService, CognitoUtil } from '../../services/cognito.service';

@Component({
    selector: 'app-main',
    templateUrl: 'main-view.template.html'
})

export class MainViewComponent implements LoggedInCallback, OnInit {
    private commentsUrl;

    constructor(
        public router: Router,
        public cognitoUtil: CognitoUtil,
        public userService: UserLoginService,
        private http: Http
    ) {
        // Checking if the user is already authenticated.
        // If so, then redirect to the secure site
        // this.userService.isAuthenticated(this);
    }

    ngOnInit() {
        console.log(this.cognitoUtil.getCurrentUser())
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate(['/login']);
        }
    }
}

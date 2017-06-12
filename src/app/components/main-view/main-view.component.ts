import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { LoggedInCallback, UserLoginService, CognitoUtil } from '../../service/cognito.service';

@Component({
    selector: 'mianView',
    templateUrl: 'main-view.template.html'
})

export class mainViewComponent implements LoggedInCallback {
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
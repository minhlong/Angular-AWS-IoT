import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserLoginService, LoggedInCallback } from '../../service/cognito.service';
import { CognitoCallback } from './../../service/cognito.service';

@Component({
    selector: 'login',
    templateUrl: 'login.template.html'
})
export class loginComponent implements CognitoCallback, LoggedInCallback {
    public email: string;
    public password: string;
    public errorMessage: string;

    constructor(
        public router: Router,
        public userService: UserLoginService
    ) {
        console.log("LoginComponent constructor");
    }

    ngOnInit() {
        this.errorMessage = null;

        // Checking if the user is already authenticated.
        // If so, then redirect to the secure site
        this.userService.isAuthenticated(this);
    }

    onLogin() {
        if (this.email == null || this.password == null) {
            this.errorMessage = "All fields are required";
            return;
        }
        this.errorMessage = null;
        this.userService.authenticate(this.email, this.password, this);
    }

    /**
     * Callback after click login for check authentication
     * 
     * @param message 
     * @param result 
     */
    cognitoCallback(message: string, result: any) {
        if (message != null) { //error
            this.errorMessage = message;
            console.log("result: " + this.errorMessage);
            if (this.errorMessage === 'User is not confirmed.') {
                console.log("redirecting");
                this.router.navigate(['/home/confirmRegistration', this.email]);
            }
        } else { //success
            this.router.navigate(['/securehome']);
        }
    }

    /**
     * Callback after check authentication on Init time
     * @param message 
     * @param isLoggedIn 
     */
    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (isLoggedIn)
            this.router.navigate(['/home']);
    }
}
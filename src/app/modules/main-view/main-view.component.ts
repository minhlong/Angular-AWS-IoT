import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { LoggedInCallback, UserLoginService, CognitoUtil } from '../../service/cognito.service';

@Component({
    selector: 'mianView',
    templateUrl: 'main-view.template.html'
})
export class mainViewComponent implements LoggedInCallback {

    constructor(
        public router: Router,
        public cognitoUtil: CognitoUtil,
        public userService: UserLoginService
    ) {
        this.userService.isAuthenticated(this);
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
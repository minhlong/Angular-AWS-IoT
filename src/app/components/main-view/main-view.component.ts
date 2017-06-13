import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { CognitoAuthService, LoggedInCallback } from './../../services/cognito-auth.service';
import { environment } from '../../../environments/environment';

declare const AWS: any;

@Component({
    selector: 'app-main',
    templateUrl: 'main-view.template.html'
})
export class MainViewComponent implements LoggedInCallback, OnInit {
    token: any
    apiURL: any
    locationData: any

    apiIoT: String = 'a243uabiez3zv6.iot.us-east-1.amazonaws.com'
    thingName: String = 'HMLong-Thing1'
    thingShadow: any = '{ "state": { "desired" : { "color" : { "r" : 10 }, "engine" : "ON" } } }'
    iotData: any

    private iotdata: any

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
        this.apiURL = environment.API_URL + '/locations';
        this.token = CognitoAuthService.token;

        // Get Data
        this.getInfoApiUserPools(this.token).subscribe((data) => {
            this.locationData = data
        });

        // Get Data Shadow
        this.iotdata = new AWS.IotData({
            endpoint: this.apiIoT
        });
        const that = this
        this.iotdata.getThingShadow({ thingName: this.thingName }, function(err, data) {
            if (err) {
                console.log(err);
            } else {
                that.iotData = data
            }
        });
    }

    /**
     * Callback after check authentication on Init time
     *
     * @param message
     * @param isLoggedIn
     */
    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate(['/login']);
        }
    }

    /**
     * Update IoT Shadow
     * Ref https://stackoverflow.com/questions/40104559/forbidden-exception-on-accessing-aws-iot-using-amazon-cognito
     */
    updateIoT() {
        const options = {
            thingName: this.thingName,
            payload: this.thingShadow
        };
        const that = this
        this.iotdata.updateThingShadow(options, function(err, data) {
            if (err) {
                console.log(err);
            } else {
                that.iotData = data
            }
        });
    }

    /**
     * Get data from the API URL with the token
     * @param token
     */
    private getInfoApiUserPools(token): Observable<any> {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this._http.get(this.apiURL, { headers: headers })
            .map(res => res.json())
            .catch(this._serverError);
    }

    /**
     * Handle error from the HTTP
     * @param err
     */
    private _serverError(err: any) {
        if (err.status === 0) {
            return Observable.throw(err.json().error || 'UNAUTHORIZED!!!');
        }
        if (err instanceof Response) {
            return Observable.throw(err.json().error || 'Backend Server Error');
        }
    }
}

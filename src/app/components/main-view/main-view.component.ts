import { Component, OnInit } from '@angular/core';

import { environment } from '../../../environments/environment.prod';
import { JwtAuthHttp } from './../../services/http-auth.service';
import { consoleLog } from '../../app.helpers';

declare const AWS: any;

@Component({
  selector: 'app-main',
  templateUrl: 'main-view.template.html'
})
export class MainViewComponent implements OnInit {
  token: any = localStorage.getItem('token')
  apiURL: any = environment.API_URL + '/locations'
  locationData: any

  apiIoT: String = 'a243uabiez3zv6.iot.us-east-1.amazonaws.com'
  thingName: String = 'HMLong-Thing1'
  thingShadow: any = '{ "state": { "desired" : { "color" : { "r" : 10 }, "engine" : "ON" } } }'
  iotData: any
  private ioTShadow: any

  constructor(
    private _http: JwtAuthHttp,
  ) {
  }

  ngOnInit() {
    this.getLocations();
    this.initIoTShadow();
  }


  private getLocations() {
    this._http
      .get(this.apiURL)
      .map(res => res.json())
      .subscribe(data => {
        this.locationData = data
      });
  }

  initIoTShadow() {
    // Update AWS token for use in another services
    const cognitoParams = {
      IdentityPoolId: environment.identityPoolId,
      Logins: {}
    };
    cognitoParams.Logins[
      'cognito-idp.' + environment.region +
      '.amazonaws.com/' + environment.userPoolId
    ] = localStorage.getItem('token');
    AWS.config.credentials = new AWS.CognitoIdentityCredentials(cognitoParams);

    // Get Data Shadow
    this.ioTShadow = new AWS.IotData({
      endpoint: this.apiIoT
    });
    const that = this
    this.ioTShadow.getThingShadow({ thingName: this.thingName }, function (err, data) {
      if (err) {
        consoleLog(err);
      } else {
        that.iotData = data
      }
    });
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
    this.ioTShadow.updateThingShadow(options, function (err, data) {
      if (err) {
        consoleLog(err);
      } else {
        that.iotData = data
      }
    });
  }
}

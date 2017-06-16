import { Component } from '@angular/core';

import { environment } from '../../../environments/environment.prod';
import { JwtAuthHttp } from './../../services/http-auth.service';

@Component({
  selector: 'app-main',
  templateUrl: 'main-view.template.html'
})
export class MainViewComponent {
  token: any = localStorage.getItem('token')
  apiURL: any = environment.API_URL + '/locations'
  locationData: any

  apiIoT: String = 'a243uabiez3zv6.iot.us-east-1.amazonaws.com'
  thingName: String = 'HMLong-Thing1'
  iotPolicy: String = 'HMLong-Policy1'
  thingShadow: any = '{ "state": { "desired" : { "color" : { "r" : 10 }, "engine" : "ON" } } }'
  iotData: any

  constructor(
    private _http: JwtAuthHttp
  ) {
    this.getLocations();
  }

  private getLocations() {
    this._http
      .get(this.apiURL)
      .map(res => res.json())
      .subscribe(data => {
        this.locationData = data
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { JwtAuthHttp } from '../../services/http-auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-device-management',
  templateUrl: './device-management.component.html',
})
export class DeviceManagementComponent implements OnInit {
  locationCount;
  deviceCount;

  constructor(
    private _http: JwtAuthHttp,
  ) {
  }

  ngOnInit() {
    this.getInfo();
  }

  /**
   * Get information from the server
   */
  private getInfo() {
    this._http
      .get(environment.API_URL + '/things')
      .map(res => res.json())
      .subscribe(data => {
        this.deviceCount = data.Count;
      });
    this._http
      .get(environment.API_URL + '/locations')
      .map(res => res.json())
      .subscribe(data => {
        this.locationCount = data.Count;
      });
  }
}

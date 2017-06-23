import { Component, OnInit } from '@angular/core';

import { environment } from '../../../environments/environment.prod';
import { JwtAuthHttp } from './../../services/http-auth.service';

declare const AWS: any;
declare const JSONEditor: any;

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html'
})
export class ApiComponent implements OnInit {

  isLoading = true;
  urlAPIGetway = environment.APIGateway_URL;

  constructor(
    private _http: JwtAuthHttp,
  ) {
  }

  ngOnInit() {
    this.getLocations();
  }

  private getLocations() {
    const _eJson = new JSONEditor(document.getElementById('jeAPIG'));
    this._http
      .get(this.urlAPIGetway)
      .map(res => res.json())
      .subscribe(res => {
        this.isLoading = false;
        _eJson.set(res);
      });
  }
}

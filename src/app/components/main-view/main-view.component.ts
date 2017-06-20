import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as mqtt from 'mqtt';

import { environment } from '../../../environments/environment.prod';
import { JwtAuthHttp } from './../../services/http-auth.service';
import { consoleLog } from '../../app.helpers';
import { MQTTService } from './../../services/mqtt.service';

declare const AWS: any;

@Component({
  selector: 'app-main',
  templateUrl: 'main-view.template.html'
})
export class MainViewComponent implements OnInit {
  apiGetway = {
    token: localStorage.getItem('token'),
    url: environment.API_URL + '/locations',
    data: null
  }

  ioT = {
    restFul: {
      url: 'a243uabiez3zv6.iot.us-east-1.amazonaws.com',
      thingName: 'HMLong-Thing1',
      thingShadow: '{ "state": { "desired" : { "color" : "red" } } }',
      data: null,
    },
    mqtt: {
      topic: '$aws/things/HMLong-Thing1/shadow',
      payload: null,
    }
  }
  ioTShadow: any
  clientMQTT: any

  constructor(
    private _http: JwtAuthHttp,
    private _mqtt: MQTTService,
  ) {
    this.initMQTT();
  }

  ngOnInit() {
    this.getLocations();
    this.initIoTShadowRestF();
  }

  private getLocations() {
    this._http
      .get(this.apiGetway.url)
      .map(res => res.json())
      .subscribe(res => {
        this.apiGetway.data = res
      });
  }

  initIoTShadowRestF() {
    // Get Data Shadow
    this.ioTShadow = new AWS.IotData({
      endpoint: this.ioT.restFul.url
    });

    const _observable = Observable.bindCallback(this.ioTShadow.getThingShadow);
    _observable.call(this.ioTShadow, { thingName: this.ioT.restFul.thingName }).subscribe(([err, res]) => {
      this.ioT.restFul.data = JSON.parse(res.payload)
    });
  }

  /**
   * Update IoT Shadow
   * Ref https://stackoverflow.com/questions/40104559/forbidden-exception-on-accessing-aws-iot-using-amazon-cognito
   */
  updateIoTRestF() {
    const _observable = Observable.bindCallback(this.ioTShadow.updateThingShadow);
    const _pars = { thingName: this.ioT.restFul.thingName, payload: this.ioT.restFul.thingShadow };
    _observable.call(this.ioTShadow, _pars).subscribe(([err, res]) => {
      this.ioT.restFul.data = JSON.parse(res.payload)
    });
  }

  initMQTT() {
    this._mqtt.generateURL().subscribe((_url) => {
      this.clientMQTT = mqtt.connect(_url);
      Observable.bindCallback(this.clientMQTT.on)
        .call(this.clientMQTT, 'connect')
        .subscribe(() => {

          // Handle Received Messages
          Observable.fromEvent(this.clientMQTT, 'message', (topic, message) => {
            return {
              topic: topic,
              mess: message
            }
          }).subscribe((res) => {
            this.ioT.mqtt.payload = JSON.parse(res.mess.toString());
          });

          // Register topic
          this.clientMQTT.subscribe(this.ioT.mqtt.topic + '/update' + '/accepted')
          this.clientMQTT.subscribe(this.ioT.mqtt.topic + '/get' + '/accepted')
          // Get State
          this.clientMQTT.publish(this.ioT.mqtt.topic + '/get')
        });
    })
  }

  updateIoTMQTT() {
    this.clientMQTT.publish(this.ioT.mqtt.topic + '/update', this.ioT.restFul.thingShadow)
  }
}

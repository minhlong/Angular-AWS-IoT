import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as mqtt from 'mqtt';

import { consoleLog } from '../../app.helpers';
import { MQTTService } from './../../services/mqtt.service';
import { environment } from './../../../environments/environment';

declare const AWS: any;
declare const JSONEditor: any;

@Component({
  selector: 'app-iot-protocol',
  templateUrl: './iot-protocol.component.html'
})
export class IotProtocolComponent implements OnInit {
  isLoading = true;

  ioT = {
    restFul: {
      url: environment.ioTRestFURL,
      thingName: environment.ioTThingName,
    }
  }
  ioTRestF: any
  ioTMQTT: any

  // JsonEditor
  jeShadowRestF: any
  jeShadowMQTT: any
  jeShadowRestFData: any

  constructor(
    private _mqtt: MQTTService,
  ) {
  }

  ngOnInit() {
    this.initIoTRestF();
    this.initIoTMQTT();
    this.initJsonE();
  }

  initJsonE() {
    const _defaultShadow = {
      state: {
        desired: {
          color: 'red'
        }
      }
    };
    const _options = {
      mode: 'code'
    };

    this.jeShadowMQTT = new JSONEditor(document.getElementById('jeShadow'), _options);
    this.jeShadowRestF = new JSONEditor(document.getElementById('jeShadowRestF'), _options);
    this.jeShadowMQTT.set(_defaultShadow);
    this.jeShadowRestF.set(_defaultShadow);
  }

  initIoTRestF() {
    this.jeShadowRestFData = new JSONEditor(document.getElementById('jeShadowRestFData'), { mode: 'view' });

    // Get Data Shadow
    this.ioTRestF = new AWS.IotData({
      endpoint: this.ioT.restFul.url
    });

    this.ioTRestF.getThingShadow({ thingName: this.ioT.restFul.thingName }, (err, res) => {
      this.jeShadowRestFData.set(JSON.parse(res.payload))
    })
  }

  initIoTMQTT() {
    const jeShadowMQTTData = new JSONEditor(document.getElementById('jeShadowMQTTData'), { mode: 'view' });
    let socketURL = null;

    this._mqtt.generateURL().subscribe((_url) => {
      socketURL = _url;
      this.ioTMQTT = mqtt.connect(socketURL, {

        // Reconnect after disconnec from the network
        transformWsUrl: (url, options, client) => {
          this._mqtt.generateURL().subscribe((_res) => {
            consoleLog('Reconnect MQTT!')
            socketURL = _res;
          });
          return socketURL
        }
      });

      // Handle Received Messages
      this.ioTMQTT.on('message', (topic, message) => {
        jeShadowMQTTData.set(JSON.parse(message.toString()))
      })

      // Handle Conncted
      this.ioTMQTT.on('connect', () => {
        this.isLoading = false;
        // Register topic
        this.ioTMQTT.subscribe('$aws/things/' + this.ioT.restFul.thingName + '/shadow/update' + '/documents')
        this.ioTMQTT.subscribe('$aws/things/' + this.ioT.restFul.thingName + '/shadow/get' + '/accepted')

        // Get current shadow after x second
        setTimeout(() => {
          this.ioTMQTT.publish('$aws/things/' + this.ioT.restFul.thingName + '/shadow/get', '')
        }, 500)
      })
    })
  }

  /**
   * Update State Shadow
   * Ref https://stackoverflow.com/a/41449362
   * aws iot attach-principal-policy --principal "cognito user id" --policy-Name "policy name"
   * @param mqttPro
   */
  updateIoT(mqttPro: boolean = false) {
    if (mqttPro) {
      // MQTT Protocol
      this.ioTMQTT.publish('$aws/things/' + this.ioT.restFul.thingName + '/shadow/update', JSON.stringify(this.jeShadowMQTT.get()))
    } else {
      // RestFul Protocol
      const _pars = {
        thingName: this.ioT.restFul.thingName,
        payload: JSON.stringify(this.jeShadowRestF.get())
      };

      this.ioTRestF.updateThingShadow(_pars, (err, res) => {
        this.jeShadowRestFData.set(JSON.parse(res.payload))
      })
    }
  }
}

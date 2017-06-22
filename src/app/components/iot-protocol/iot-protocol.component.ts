import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as mqtt from 'mqtt';

import { consoleLog } from '../../app.helpers';
import { MQTTService } from './../../services/mqtt.service';

declare const AWS: any;
declare const JSONEditor: any;

@Component({
  selector: 'app-iot-protocol',
  templateUrl: './iot-protocol.component.html'
})
export class IotProtocolComponent implements OnInit {
  ioT = {
    restFul: {
      url: 'a243uabiez3zv6.iot.us-east-1.amazonaws.com',
      thingName: 'HMLong-Thing1',
    },
    mqtt: {
      topic: '$aws/things/HMLong-Thing1/shadow',
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
        // Register topic
        this.ioTMQTT.subscribe(this.ioT.mqtt.topic + '/update' + '/accepted')
        this.ioTMQTT.subscribe(this.ioT.mqtt.topic + '/get' + '/accepted')

        // Get current shadow after x second
        setTimeout(() => {
          this.ioTMQTT.publish(this.ioT.mqtt.topic + '/get', '')
        }, 500)
      })
    })
  }

  /**
   * Update State Shadow
   * Ref https://stackoverflow.com/questions/40104559/forbidden-exception-on-accessing-aws-iot-using-amazon-cognito
   * @param mqttPro
   */
  updateIoT(mqttPro: boolean = false) {
    if (mqttPro) {
      // MQTT Protocol
      this.ioTMQTT.publish(this.ioT.mqtt.topic + '/update', JSON.stringify(this.jeShadowMQTT.get()))
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

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as mqtt from 'mqtt';

import { MQTTService } from './../../services/mqtt.service';
import { consoleLog } from '../../app.helpers';
import { environment } from './../../../environments/environment';

declare const AWS: any;
declare const JSONEditor: any;

@Component({
  selector: 'app-iot-flow',
  templateUrl: './iot-flow.component.html',
})
export class IotFlowComponent implements OnInit {
  isLoading = true;
  thingName = environment.ioTThingName;

  awsClient: mqtt.Client

  constructor(
    private _mqtt: MQTTService,
  ) {
  }

  ngOnInit() {
    this.initAWSIoT();
  }

  initAWSIoT() {
    const _je = new JSONEditor(document.getElementById('jeIoTShadow'), { mode: 'view' });
    let _socketURL = null;

    this._mqtt.generateURL().subscribe((_url) => {
      _socketURL = _url;
      this.awsClient = mqtt.connect(_socketURL, {

        // Reconnect after disconnec from the network
        transformWsUrl: (url, options, client) => {
          this._mqtt.generateURL().subscribe((_res) => {
            _socketURL = _res;
          });
          return _socketURL
        }
      });

      // Handle Received Messages
      this.awsClient.on('message', (topic, message: string) => {
        const _match = topic.match(/\/shadow\/(.+)$/);
        let _payload = JSON.parse(message.toString());

        if (_match) {
          switch (_match[1]) {
            case 'update/documents':
              consoleLog(_match[1] + '===============');
              _payload = _payload.current.state;
              _je.set(_payload)
              _je.expandAll();
              break;
            case 'get/accepted':
              consoleLog(_match[1] + '===============');
              _payload = _payload.state;
              _je.set(_payload)
              _je.expandAll();
              break;
            default:
              consoleLog(_match[1]);
              consoleLog(_payload);
              break;
          }
        } else {
          consoleLog(_payload);
        }
      })

      // Handle Conncted
      this.awsClient.on('connect', () => {
        // Register topic
        this.awsClient.subscribe('$aws/things/' + this.thingName + '/shadow/update/documents')
        this.awsClient.subscribe('$aws/things/' + this.thingName + '/shadow/update/delta')
        this.awsClient.subscribe('$aws/things/' + this.thingName + '/shadow/update/rejected')
        this.awsClient.subscribe('$aws/things/' + this.thingName + '/shadow/get/accepted')
        this.awsClient.subscribe('$aws/things/' + this.thingName + '/shadow/get/rejected')

        // Get current shadow after x second
        setTimeout(() => {
          this.isLoading = false;
          this.awsClient.publish('$aws/things/' + this.thingName + '/shadow/get', '')
        }, 1000)
      })
    })
  }

  dvUpdateState(color: string) {
    this.awsClient.publish('$aws/things/' + this.thingName + '/shadow/update', JSON.stringify({
      state: {
        desired: {
          color: color
        }
      }
    }))
  }
}

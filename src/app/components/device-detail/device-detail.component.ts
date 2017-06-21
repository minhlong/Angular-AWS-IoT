import { Component, OnInit } from '@angular/core';
import * as mqtt from 'mqtt';

import { MQTTService } from '../../services/mqtt.service';
import { consoleLog } from '../../app.helpers';

declare const AWS: any;
declare const JSONEditor: any;

@Component({
  selector: 'app-device-detail',
  templateUrl: './device-detail.component.html',
})
export class DeviceDetailComponent implements OnInit {

  thingName = 'HMLong-Intelligent-Storage'
  topic
  jeThingShadow
  jeThingState
  ioTShadow
  ioTMQTT: mqtt.Client

  constructor(
    private _mqtt: MQTTService,
  ) {
    this.topic = '$aws/things/' + this.thingName + '/shadow'
  }

  ngOnInit() {
    this.getThingInfor();
    this.initMQTT();
  }

  getThingInfor() {
    const _je = new JSONEditor(document.getElementById('jeThingInfo'), { mode: 'view' });
    const _iot = new AWS.Iot();

    _iot.describeThing({ thingName: this.thingName }, function (err, data) {
      _je.set(data);
    });
  }

  initMQTT() {
    // Define json editor
    this.jeThingShadow = new JSONEditor(document.getElementById('jeThingShadow'), { mode: 'view' });
    this.jeThingState = new JSONEditor(document.getElementById('jeThingState'), { mode: 'tree' });
    this.jeThingState.set({
      state: {
        desired: {
          connected: true,
          location: {
            lat: 123,
            len: 456
          },
          time_in_service: 1, // year
          life_remaining: 50, // percentage
          estimate_remaining: {
            start: 1498030491,
            end: 1498030491,
          },
          traffic_trend: [
            {
              1498030491: 455646564 // Date : gb_/_day_written
            },
            {
              1498030491: 455646564
            }
          ],
          current_event: [
            {
              event_type: 'Lorem',
              event_number: 'Lorem',
              event_note: 'Lorem',
              severity: 'Lorem',
              status: 'Lorem',
              timestamp: 1498030491,
              total_occurences: 'Lorem'
            },
            {
              event_type: 'Lorem',
              event_number: 'Lorem',
              event_note: 'Lorem',
              severity: 'Lorem',
              status: 'Lorem',
              timestamp: 1498030491,
              total_occurences: 'Lorem'
            },
          ]
        }
      }
    });
    // Define thing Shadow
    let socketURL = null;
    const self = this;
    this._mqtt.generateURL().subscribe((_url) => {
      socketURL = _url;
      this.ioTMQTT = mqtt.connect(socketURL, {
        // Detecting a Thing is Connected - MQTT Last Will and Testament (LWT)
        // http://docs.aws.amazon.com/iot/latest/developerguide/thing-shadow-data-flow.html
        will: {
          topic: 'Disconnect/HMLong-Intelligent-Storage',
          payload: JSON.stringify({
            state: {
              reported: {
                connected: false
              }
            }
          }),
          qos: 0,
          retain: false
        },
        // Reconnect after disconnec from the network
        transformWsUrl: function (url, options, client) {
          self._mqtt.generateURL().subscribe((_res) => {
            consoleLog('Reconnect MQTT!')
            socketURL = _res;
          });
          return socketURL
        }
      });

      // Handle Received Messages
      this.ioTMQTT.on('message', (topic, message) => {
        this.jeThingShadow.set(JSON.parse(message.toString()));
        this.jeThingShadow.expandAll();
      })

      // Handle Conncted
      this.ioTMQTT.on('connect', () => {
        // Register topic
        this.ioTMQTT.subscribe(this.topic + '/update' + '/accepted')
        this.ioTMQTT.subscribe(this.topic + '/get' + '/accepted')

        // Get current shadow after x second
        setTimeout(() => {
          this.ioTMQTT.publish(this.topic + '/get', null)
        }, 1000)
      })
    })
  }

  updateIoT() {
    this.ioTMQTT.publish(this.topic + '/update', JSON.stringify(this.jeThingState.get()))
  }
}

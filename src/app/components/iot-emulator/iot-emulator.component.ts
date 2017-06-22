import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as mqtt from 'mqtt';

import { AppState } from './../../store/reducers/index';
import { AuthActions } from './../../store/actions/auth.action';
import { MQTTService } from './../../services/mqtt.service';

@Component({
  selector: 'app-iot-emulator',
  templateUrl: './iot-emulator.component.html',
})
export class IotEmulatorComponent implements OnInit {

  thingName = 'HMLong-Thing1';
  color = '';
  deviceClient: mqtt.Client

  constructor(
    private _mqtt: MQTTService,
    private authActions: AuthActions,
    private store: Store<AppState>
  ) {
    // Preprate token
    this.store.dispatch(this.authActions.getLoggedUser());
  }

  ngOnInit() {
  }

  dvConnect() {
    let _socketURL = null;

    this._mqtt.generateURL().subscribe((_url) => {
      _socketURL = _url;
      this.deviceClient = mqtt.connect(_socketURL, {
        // Detecting a Thing is Connected - MQTT Last Will and Testament (LWT)
        // http://docs.aws.amazon.com/iot/latest/developerguide/thing-shadow-data-flow.html
        will: {
          topic: 'Disconnect/' + this.thingName,
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
        transformWsUrl: (url, options, client) => {
          console.log(options);
          this._mqtt.generateURL().subscribe((_res) => {
            _socketURL = _res;
          });
          return _socketURL
        }
      });

      // Handle Received Messages
      this.deviceClient.on('message', (topic, message) => {
        const _match = topic.match(/\/shadow\/(.+)$/);
        const _payload = JSON.parse(message.toString());

        if (_match) {
          switch (_match[1]) {
            case 'update/delta':
              if (_payload.state.color) {
                this.updateColor(_payload.state.color, true);
              }
              break;
            case 'get/accepted':
              if (_payload.state.delta && _payload.state.delta.color) {
                this.updateColor(_payload.state.delta.color, true);
              } else if (_payload.state.reported && _payload.state.reported.color) {
                this.updateColor(_payload.state.reported.color);
              }
              break;
          }
        } else {
        }
      })

      // Handle Conncted
      this.deviceClient.on('connect', () => {
        // Register topic
        this.deviceClient.subscribe('$aws/things/' + this.thingName + '/shadow/update/delta')
        this.deviceClient.subscribe('$aws/things/' + this.thingName + '/shadow/get/accepted')

        // Get current shadow after x second
        setTimeout(() => {
          this.deviceClient.publish('$aws/things/' + this.thingName + '/shadow/get', '')
          this.deviceClient.publish('$aws/things/' + this.thingName + '/shadow/update', JSON.stringify({
            state: {
              reported: {
                connected: true
              }
            }
          }))
        }, 500)
      })
    })
  }

  private updateColor(color, reUpdateShadow = false) {
    this.color = color;

    if (reUpdateShadow) {
      this.deviceClient.publish('$aws/things/' + this.thingName + '/shadow/update', JSON.stringify({
        state: {
          reported: {
            color: color
          }
        }
      }))
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { consoleLog } from '../../app.helpers';

declare const AWS: any;
declare const JSONEditor: any;

export interface IThing {
  attributes: any
  thingName: string
  thingTypeName: string
}

@Component({
  selector: 'app-iot-thing-info',
  templateUrl: './iot-thing-info.component.html'
})
export class IotThingInfoComponent implements OnInit {

  isLoading = true;
  things: [IThing]
  _je: any
  _iot: any

  ngOnInit() {
    this._iot = new AWS.Iot();
    this._je = new JSONEditor(document.getElementById('jeThingInfo'), { mode: 'view' });

    // List all thing
    this._iot.listThings(null, (err, data: { things: any, nextToken: string }) => {
      if (err) {
        consoleLog(err)
      } else {
        this.isLoading = false;
        this.things = data.things;
      }
    });
  }

  detail(thingName) {
    consoleLog(thingName);
    // Get Thing information
    this._iot.describeThing({ thingName: thingName }, (err, data) => {
      if (err) {
        consoleLog(err);
      } else {
        this._je.set(data);
        this._je.expandAll();
      }
    });
  }
}

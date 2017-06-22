import { Component, OnInit } from '@angular/core';

declare const AWS: any;
declare const JSONEditor: any;

@Component({
  selector: 'app-iot-thing-info',
  templateUrl: './iot-thing-info.component.html'
})
export class IotThingInfoComponent implements OnInit {

  thingName = 'HMLong-Intelligent-Storage'

  constructor(
  ) {
  }

  ngOnInit() {
    this.getThingInfor();
  }

  getThingInfor() {
    const _je = new JSONEditor(document.getElementById('jeThingInfo'), { mode: 'view' });
    const _iot = new AWS.Iot();

    _iot.describeThing({ thingName: this.thingName }, function (err, data) {
      _je.set(data);
      _je.expandAll();
    });
  }
}

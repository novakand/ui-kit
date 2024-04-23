import { Component, OnInit } from '@angular/core';

import { ILoadApiMap, IMainMap } from './interface';
import * as markers from './test.markers.json';
import { GoogleMap } from './class/google';
import * as data from './maps.const.json';

@Component({
  selector: 'h21-maps-components-docs',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css'],
})
export class MapsComponent implements OnInit {

  public source: IMainMap;

  public init(code: string) {
    switch (code) {
      case 'yandex':
      case 'leaftlet':
      case 'baidu':
      default: {
        this.source = new GoogleMap();
      }
    }
    const dt: ILoadApiMap = (<any>data).InitList[code];
    this.source.init.loadScriptMap(dt).then((map) => {
      if (map.status === 'Loaded') {
        const load = this.source.init.initializingMap();
        this.source.map = load.map;
        this.source.cluster = load.markercluster;
        this.source.traffic = load.traffic;
        this.source.events.subscribe(this.source.map);
      }
    }).catch(() => {
    });
  }

  public zoomLevel(type) {
    this.source.config.setZoomLevel(this.source.map, type);
  }

  public drawShape(type) {
    this.source.config.drawingShapesMap(this.source.map, type);
  }

  public createMarker(type) {
    this.source.config.setZoomLevel(this.source.map, 'plus');
  }

  public loadMarkers() {
    let markersArray: any;
    markersArray = markers.default;
    this.source.config.setMarkers(this.source.map, markersArray, this.source.cluster);
  }

  public clearMap() {
    this.source.config.clearMap(this.source.map);
  }

  public ngOnInit() {
    setTimeout(() => this.init('google'), 1000);
  }

}

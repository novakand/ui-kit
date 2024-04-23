import { Injectable } from '@angular/core';


import {
  IEventMap,
  IMainMap,
  IMapOptions,
  IMarkerClusterMap,
  IMarkerMap,
  InfoWindowMap,
  InitMap,
} from '../../interface';
import { Markercluster } from './class-markercluster';
import { Initialize } from './class-initialize';
import { InfoWindow } from './class-infowindow';
import { Options } from './class-config';
import { Marker } from './class-marker';
import { Events } from './class-event';

@Injectable()
export class GoogleMap implements IMainMap {

    public init: InitMap;
    public events: IEventMap;
    public config: IMapOptions;
    public marker: IMarkerMap;
    public infoWindow: InfoWindowMap;
    public markerCluster: IMarkerClusterMap;

    public map: any;
    public traffic: any;
    public transit: any;
    public cluster: any;

    constructor() {
        this.init = new Initialize();
        this.events = new Events();
        this.config = new Options();
        this.marker = new Marker();
        this.infoWindow = new InfoWindow();
        this.markerCluster = new Markercluster();

    }

    public showMarkers(markers: any[]) {
        this.config.showMarker(this.map, markers, this.markerCluster);
    }

}

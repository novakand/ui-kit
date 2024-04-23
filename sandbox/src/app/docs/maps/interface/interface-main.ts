import { IMarkerClusterMap } from './interface-markercluster';
import { InfoWindowMap } from './interface-infowindow';
import { IMapOptions } from './interface-config';
import { IMarkerMap } from './interface-marker';
import { IEventMap } from './interface-event';
import { InitMap } from './interface-init';

export interface IMainMap {
    map: any;
    traffic: any;
    transit: any;
    cluster: any;
    init: InitMap;
    events: IEventMap;
    config: IMapOptions;
    marker: IMarkerMap;
    markerCluster: IMarkerClusterMap;
    infoWindow: InfoWindowMap;
}

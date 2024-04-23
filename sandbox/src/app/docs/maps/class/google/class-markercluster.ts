import { IMarkerClusterMap } from '../../interface/interface-markercluster';

export class Markercluster implements IMarkerClusterMap {

    public Cluster: any;

    public listenEvent(map: any, eventName: string) {
        throw new Error('Method not implemented.');
    }

    public clickMarkerCluster(map: any, marker: any) {
        throw new Error('Method not implemented.');
    }

}

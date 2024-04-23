import { Observable, Observer } from 'rxjs';

import { IMarkerMap } from '../../interface';

export class Marker implements IMarkerMap {

    public listenEvent<E>(marker: any, eventName: string): Observable<E> {
        return new Observable((observer: Observer<E>) => {
            marker.addListener(eventName, (arg: E) => { observer.next(arg); });
        });
    }

    public clickMarker(marker: any) { }

}

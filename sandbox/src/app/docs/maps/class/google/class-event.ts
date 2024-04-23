import { Observable, Observer } from 'rxjs';

import { IEventMap } from '../../interface';

export class Events implements IEventMap {

    public subscribe(map: any) {
        this.clickMap(map);
        this.boundsChange(map);
        this.idle(map);
        this.zoomChange(map);
    }

    public listenEvent<E>(map: any, eventName: string): Observable<E> {
        return new Observable((observer: Observer<E>) => {
            map.addListener(eventName, (arg: E) => { observer.next(arg); });
        });
    }

    public idle(map: any) {
        this.listenEvent<void>(map, 'idle').subscribe(() => { });
    }

    public boundsChange(map: any) {
        this.listenEvent<void>(map, 'bounds_changed').subscribe(() => { });
    }

    public zoomChange(map: any) {
        this.listenEvent<void>(map, 'zoom_changed').subscribe(() => { });
    }
    public clickMap(map: any) {
        this.listenEvent<any>(map, 'click').subscribe((event) => {
            if (event.placeId) {
                event.stop();
            }
        });
    }

}

import * as MarkerClusterer from '@google/markerclustererplus';

import { ILoadApiMap, InitMap } from '../../interface';
import * as mapstyle from '../../class/google/maps.style.json';

declare var document: any;
declare var google: any;

export class Initialize implements InitMap {

    public source: ILoadApiMap;

    public loadScriptMap(source: ILoadApiMap): Promise<any> {
        return new Promise((resolve, reject) => {
            this.source = source;
            const script = document.createElement('script');

            script.type = 'text/javascript';
            script.src = `${source.src}&key=${source.key}&v=${source.version}&language=${source.language}`;

            if (script.readyState) {
                script.onreadystatechange = () => {
                    if (script.readyState === 'loaded' || script.readyState === 'complete') {
                        script.onreadystatechange = null;
                        resolve({ loaded: true, status: 'Loaded' });
                    }
                };
            } else {
                script.onload = () => {
                    resolve({ loaded: true, status: 'Loaded' });
                };
            }
            script.onerror = () => {
                reject({ loaded: false, status: 'Error' });
            };
            document.getElementsByTagName('head')[0].appendChild(script);
        });
    }

    public initializingMap(): any {
        const mcOptions = {
            gridSize: 80, maxZoom: 18, zoomOnClick: true, ignoreHidden: true, styles: [
                {
                    textColor: 'black',
                    url: '../../images/icon/icon_pointgroup.png',
                    anchorText: [0, -2],
                    height: 44,
                    width: 44,
                }],
        };

        const map = new google.maps.Map(document.getElementById('map'), {
            center: new google.maps.LatLng(27.215556209029693, 18.45703125),
            zoom: 3,
            disableDefaultUI: true,
            minZoom: 3,
            scaleControl: true,
            draggableCursor: 'default',
            disableDoubleClickZoom: true,
            styles: mapstyle.default,
        });

        const traffic = new google.maps.TrafficLayer();
        const transit = new google.maps.TransitLayer();
        const geocoder = new google.maps.Geocoder();
        const placesService = new google.maps.places.PlacesService(map);
        const markercluster = new MarkerClusterer(map, [], mcOptions);
        return { map, traffic, transit, geocoder, placesService, markercluster };
    }

    public destroyMap() { }

}

import { IMapOptions } from '../../interface';

declare var google: any;
let markerCluster: any;
let radiusObject: any;

const polygonArea: any[] = [];
const markers: any[] = [];

export class Options implements IMapOptions {

    public showMarker(map: any, obj: any, markercluster: any) {
        try {
            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(obj.Address.Lat, obj.Address.Lng),
                draggable: false,
                clickable: true,
                icon: { url: '../../images/icon/icon_hotel.png' },
                title: obj.Hotelname,
            });

            marker.setMap(map);
            markers.push(marker);
            if (markercluster !== null) {
                markercluster.addMarker(marker, true);
                markercluster.repaint();
            }
            markerCluster = markercluster;
        } catch (error) { }
    }

    public setZoomLevel(map: any, type: string) {
        try {
            const currentZoom = +map.getZoom();
            if (type === 'plus') {
                map.setZoom(currentZoom + 1);
            } else {
                map.setZoom(currentZoom - 1);
            }
        } catch (error) { }
    }

    public drawingShapesMap(map: any, type: any) {
        try {
            const radius = 10000;

            if (radiusObject != null) {
                radiusObject.setMap(null);
            }

            if (polygonArea !== null) {
                polygonArea.forEach((item) => {
                    item.setMap(null);
                    item.getPath().clear();
                });

            }
            let option: any;

            if (type === 'circle') {
                const center = new google.maps.LatLng({ lat: 55.755814, lng: 37.617635 });
                option = {
                    strokeColor: '#1E90FF',
                    strokeOpacity: 0.9,
                    strokeWeight: 3.5,
                    fillColor: '#1E90FF',
                    fillOpacity: 0.35,
                    center: center,
                    radius: radius,
                    draggable: true,
                    editable: true,
                };
                radiusObject = new google.maps.Circle(option);
                radiusObject.setMap(map);
                google.maps.event.addListener(radiusObject, 'radius_changed', () => { });
            }

            if (type === 'area') {
                let poly: any;
                map.setOptions({
                    draggable: false,
                    scrollwheel: false,
                    disableDoubleClickZoom: false,
                });

                google.maps.event.addDomListener(map.getDiv(), 'mousedown', (e) => {
                    poly = new google.maps.Polyline({
                        map: map,
                        clickable: false, strokeColor: '#1E90FF',
                        strokeOpacity: 0.9,
                        strokeWeight: 3.5,
                        fillColor: '#1E90FF',
                        fillOpacity: 0.35,
                    });

                    polygonArea.push(poly);
                    const move = google.maps.event.addListener(map, 'mousemove', () => {
                        poly.getPath().push(e.latLng);
                    });

                    google.maps.event.addListenerOnce(map, 'mouseup', () => {
                        google.maps.event.removeListener(move);
                        const path = poly.getPath();
                        poly.setMap(null);
                        poly = new google.maps.Polygon({
                            map: map,
                            path: path, strokeColor: '#1E90FF',
                            strokeOpacity: 0.9,
                            strokeWeight: 3.5,
                            fillColor: '#1E90FF',
                            fillOpacity: 0.35,
                        });

                        polygonArea.push(poly);
                        google.maps.event.clearListeners(map.getDiv(), 'mousedown');
                        const array = poly.getPath().getArray();
                        const x1: any[] = [];
                        const y1: any[] = [];
                        array.forEach((item) => {
                            x1.push(item.lat());
                            y1.push(item.lng());

                        });

                        for (const item of markers) {
                           const b = new Options().inclusionMarkersPolygon(item, x1, y1);
                           if (b === false) {
                            item.setMap(null);
                            markerCluster.removeMarker(item);
                            // markerCluster.repaint();
                           }

                        }

                        map.setOptions({
                            draggable: true,
                            scrollwheel: true,
                            disableDoubleClickZoom: true,
                        });
                    });
                });
            }
        } catch (error) { }
    }

    public inclusionMarkersPolygon(item: any, xp: number[], yp: number[]): boolean {
        const x = item.position.lat();
        const y = item.position.lng();
        const npol = xp.length;
        let j: number = npol - 1;
        let c = false;
        for (let i = 0; i < npol; i++) {
            if ((((yp[i] <= y) && (y < yp[j])) || ((yp[j] <= y) && (y < yp[i]))) &&
                (x > (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i])) {
                c = !c;
            }
            j = i;
        }
        return c;
    }

    public inclusionMarkersRadius(map: any, Lat1: number, Lng1: number, Lat2: number, Lng2: number) { }
    public setZoomMin(map: any, zoom: number) { }
    public setZoomMax(map: any, zoom: number) { }

    public setMarkers(map: any, markersObj: any[], markerclusterObj: any) {

        new Options().clearMap(map);
        markersObj.forEach((item) => {
            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(item.Address.Lat, item.Address.Lng),
                draggable: false,
                clickable: true,
                icon: { url: '../../images/icon/icon_hotel.png' },
                title: item.Hotelname,
            });

            markers.push(marker);
        });
        markerclusterObj.addMarkers(markers, true);
        markerCluster = markerclusterObj;
        markerclusterObj.repaint();

    }

    public clearMap(map: any) {
        try {
            markers.forEach((item) => {
                item.setMap(null);
            });
            if (markerCluster != null) {
                markerCluster.clearMarkers();

            }

            if (radiusObject != null) {
                radiusObject.setMap(null);

            }
            if (polygonArea != null) {
                polygonArea.forEach((item) => {
                    item.setMap(null);
                    item.getPath().clear();
                });

            }
        } catch (error) { }
    }

    public resizeMap(map: any) { }
    public routeMap(map: any, start: any, end: any, show: boolean) { }
    public fitBounds(map: any) { }
    public setCenterMap(map: any) { }
    public getBounds(map: any) { }
    public resetMap(map: any) { }

    public getZoom(map: any): number {
        return map.getZoom();
    }

    public setZoom(map: any, zoom: number) {
        map.setZoom(zoom);
    }

    public transitLayer(map: any, transit: any, boolean: boolean) {
        if (boolean) {
            transit.setMap(map);
        } else {
            transit.setMap(null);
        }
    }

    public trafficLayer(map: any, traffic: any, boolean: boolean) {
        if (boolean) {
            traffic.setMap(map);
        } else {
            traffic.setMap(null);
        }
    }

    public getAddress(map: any, coord: any) { }

    public draggableMap(map: any, boolean: any) {
        if (boolean) {
            map.setOptions({
                draggable: false,
                zoomControl: false,
                scrollwheel: false,
                disableDoubleClickZoom: false,
            });
        } else {
            map.setOptions({
                draggable: true,
                zoomControl: true,
                scrollwheel: true,
                disableDoubleClickZoom: true,
            });
        }
    }

}

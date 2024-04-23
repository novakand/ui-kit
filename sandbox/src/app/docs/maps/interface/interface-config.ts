export interface IMapOptions {
    showMarker(map: any, marker: any, markecluster: any);
    getZoom(map: any): number;
    setZoom(map: any, zoom: number);
    setZoomMin(map: any, zoom: number);
    setZoomMax(map: any, zoom: number);
    transitLayer(map: any, transit: any, boolean: boolean);
    trafficLayer(map: any, transit: any, boolean: boolean);
    getAddress(map: any, coord: any);
    setMarkers(map: any, markers: any[], markecluster: any);
    clearMap(map: any);
    resizeMap(map: any);
    routeMap(map: any, start: any, end: any, show: boolean);
    fitBounds(map: any);
    setCenterMap(map: any);
    getBounds(map: any);
    resetMap(map: any);
    setZoomLevel(map: any, type: string);
    drawingShapesMap(map: any, type: string);
    inclusionMarkersRadius(map: any, Lat1: number, Lng1: number, Lat2: number, Lng2: number);
    inclusionMarkersPolygon(coord: any, xp: any, yp: any);
    draggableMap(map: any, boolean: boolean);
}

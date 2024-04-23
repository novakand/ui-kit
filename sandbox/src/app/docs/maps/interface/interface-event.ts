export interface IEventMap {
    subscribe(map: any);
    listenEvent(map: any, eventName: string);
    idle(map: any);
    boundsChange(map: any);
    zoomChange(map: any);
    clickMap(map: any);
}

export interface ILoadApiMap {
    name: string;
    src: string;
    key: string;
    language: string;
    version: string;
}

export interface InitMap {
    source: ILoadApiMap;
    loadScriptMap (source: ILoadApiMap);
    initializingMap(): any;
    destroyMap();
}

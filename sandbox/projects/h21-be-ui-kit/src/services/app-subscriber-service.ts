import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { Passenger, SearchFlight } from '../models';

@Injectable()
export class AppSubscriberService {

  private _search = new Subject<SearchFlight>();
  private _searchResultMode = new Subject<string>();

  private _traveler = new Subject<any>();
  private _removeTraveler = new Subject<any>();

  private _departureDate = new Subject<any>();

  private _closeMenu = new Subject<void>();

  public search(searchOptions: SearchFlight) {
    return this._search.next(searchOptions);
  }

  public clearSearch() {
    return this._search.next();
  }

  public searchObservable(): Observable<any> {
    return this._search.asObservable();
  }

  public searchResultMode(mode: string) {
    return this._searchResultMode.next(mode);
  }

  public searchResultModeObservable(): Observable<string> {
    return this._searchResultMode.asObservable();
  }

  public addTraveler(traveler: Passenger) {
    return this._traveler.next(traveler);
  }

  public removeTraveler(traveler: Passenger) {
    return this._removeTraveler.next(traveler);
  }

  public travelerObservable(): Observable<Passenger> {
    return this._traveler.asObservable();
  }

  public removeTravelerObservable(): Observable<Passenger> {
    return this._removeTraveler.asObservable();
  }

  public departureDateChanged(data: any) {
    return this._departureDate.next(data);
  }

  public departureDateObservable(): Observable<any> {
    return this._departureDate.asObservable();
  }

  public closeMenu() {
    return this._closeMenu.next();
  }

  public closeMenuObservable(): Observable<void> {
    return this._closeMenu.asObservable();
  }

}

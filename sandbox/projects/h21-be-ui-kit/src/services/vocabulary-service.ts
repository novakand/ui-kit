import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { City, Passenger, SearchFlight, SearchResult } from '../models';

@Injectable()
export abstract class VocabularyService {

  public abstract getCities(pattern: string): Observable<City[]>;

  public abstract searchFlights(options: SearchFlight): Observable<SearchResult>;

  public abstract searchPassengers(pattern: string): Observable<Passenger[]>;

}

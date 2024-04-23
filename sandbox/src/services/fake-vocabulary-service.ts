import { Injectable } from '@angular/core';

import { Subscriber } from 'rxjs/index';
import { Observable } from 'rxjs';

import { VocabularyService } from '../../projects/h21-be-ui-kit/src/services';

import {
  City,
  FlightItem,
  FlightItemGroup,
  FlightItemTransfer,
  Passenger,
  SearchFlight,
  SearchResult,
} from '../../projects/h21-be-ui-kit/src/models';

@Injectable()
export class FakeVocabularyService implements VocabularyService {

  public getCities(pattern: string): Observable<City[]> {
    const data = [
      new City({
        id: 1,
        name: 'Moscow',
        code: 'MOS',
        countryCode: null,
        isTransient: false,
        airports: [
          {
            code: 'VKO',
            name: 'Vnukovo',
          },
          {
            code: 'SVO',
            name: 'Sheremetyevo',
          },
          {
            code: 'DME',
            name: 'Domodedovo',
          },
        ],
      }),
      new City({
        id: 2,
        name: 'New York',
      }),
      new City({
        id: 3,
        name: 'Bagdad',
      }),
      new City({
        id: 4,
        name: 'Erevan',
      }),
    ];
    return Observable.create((observer: Subscriber<any>) => {
      observer.next(data);
      observer.complete();
    });
  }

  public searchFlights(options: SearchFlight): Observable<SearchResult> {
    const data = {
      groups: [
        new FlightItemGroup({
          price: 250,
          totalElapsedTime: 355,
          items: [
            new FlightItem({
              arrivalDateTime: new Date(),
              arrivalAirportCode: 'MOS',
              elapsedTime: 100,
              departureDateTime: new Date(),
              departureAirportCode: 'SPB',
              arrivalLogo: 'swiss.svg',
              departureLogo: 'swiss.svg',
              transfers: [ new FlightItemTransfer({
                time: new Date(),
              })],
            }),
            new FlightItem({
              arrivalDateTime: new Date(),
              arrivalAirportCode: 'LON',
              elapsedTime: 100,
              departureDateTime: new Date(),
              departureAirportCode: 'SPB',
              arrivalLogo: 'swiss.svg',
              departureLogo: 'swiss.svg',
            }),
          ],
        }),
        new FlightItemGroup({
          price: 250,
          totalElapsedTime: 345,
          items: [
            new FlightItem({
              arrivalDateTime: new Date(),
              arrivalAirportCode: 'MOS',
              elapsedTime: 100,
              departureDateTime: new Date(),
              departureAirportCode: 'SPB',
              arrivalLogo: 'swiss.svg',
              departureLogo: 'swiss.svg',
            }),
            new FlightItem({
              arrivalDateTime: new Date(),
              arrivalAirportCode: 'LON',
              elapsedTime: 100,
              departureDateTime: new Date(),
              departureAirportCode: 'SPB',
              arrivalLogo: 'swiss.svg',
              departureLogo: 'swiss.svg',
            }),
          ],
        }),
        new FlightItemGroup({
          price: 250,
          totalElapsedTime: 290,
          items: [
            new FlightItem({
              arrivalDateTime: new Date(),
              arrivalAirportCode: 'MOS',
              elapsedTime: 100,
              departureDateTime: new Date(),
              departureAirportCode: 'SPB',
              arrivalLogo: 'swiss.svg',
              departureLogo: 'swiss.svg',
            }),
            new FlightItem({
              arrivalDateTime: new Date(),
              arrivalAirportCode: 'LON',
              elapsedTime: 100,
              departureDateTime: new Date(),
              departureAirportCode: 'SPB',
              arrivalLogo: 'swiss.svg',
              departureLogo: 'swiss.svg',
            }),
          ],
        }),
      ],
    };
    return Observable.create((observer: Subscriber<any>) => {
      observer.next(data);
      observer.complete();
    });
  }

  public searchPassengers(pattern: string): Observable<Passenger[]> {
    const data = [
      new Passenger({
        id: '1',
        surname: 'Barak',
        firstName: 'Obama',
        company: 'H21Horse',
        position: 'Ex President',
      }),
      new Passenger({
        id: '2',
        surname: 'Gorge',
        firstName: 'Bush',
        company: 'Ex Ex President',
      }),
      new Passenger({
        id: '3',
        surname: 'Abraam',
        firstName: 'Linkoln',
        company: 'Super Ex President',
      }),
      new Passenger({
        id: '4',
        surname: 'Saddam',
        firstName: 'Hussein',
        company: 'No Dictator',
      }),
    ];
    return Observable.create((observer: Subscriber<any>) => {
      observer.next(data);
      observer.complete();
    });
  }

}

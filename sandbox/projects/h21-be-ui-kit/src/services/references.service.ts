import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { HttpClientService } from './http-client.service';
import { SettingsService } from './settings.service';

import { INamedEntity } from '../interfaces/named-entity.interface';
import { ICurrency } from '../interfaces/currency.interface';
import { ILanguage } from '../interfaces/language.interface';
import { ICountry } from '../interfaces/country.interface';
import { ICity } from '../interfaces/city.interface';
import { IOrder } from '../interfaces/order.interface';
import { IQueryResult } from '../interfaces/query-result.interface';

import { QueryBase } from '../models/query.model.js';

@Injectable()
export class ReferencesService {

  constructor(
    private http: HttpClientService,
    private settings: SettingsService,
  ) { }

  // todo:для совместимости, нужно удалить
  public setReferencesUrl(url: string) {
    if (this.settings.environment) {
      this.settings.environment.referencesUrl = url;
    } else {
      this.settings.environment = { referencesUrl: url };
    }
  }

  public isReferencesUrlAssigned() {
    if (!this.settings.environment && !this.settings.environment.referencesUrl) {
      throw new Error('referencesUrl should been assigned. Please call setReferencesUrl method');
    }
    return true;
  }

  public getCountries(): Observable<ICountry[]> {
    if (this.isReferencesUrlAssigned()) {
      return this.http
        .get<ICountry[]>(`${this.settings.environment.referencesUrl}Country/GetAll`);
    }
  }

  public getCountriesByOrder(order?: IOrder[]): Observable<ICountry[]> {
    if (this.isReferencesUrlAssigned()) {
      const url = `${this.settings.environment.referencesUrl}Country/PostQuery`;
       const query = new QueryBase({ order : order });
      return this.http.post<IQueryResult<ICountry>>(url, query)
        .pipe(pluck('items'));
    }
  }

  public getCountryCities(countryCode: string): Observable<ICity[]> {
    if (this.isReferencesUrlAssigned() && countryCode) {
      return this.http
        .get<ICity[]>(`${this.settings.environment.referencesUrl}City/GetByCountryCode/${countryCode}`);
    }
  }

  public getCity(cityCode: string): Observable<ICity> {
    if (this.isReferencesUrlAssigned() && cityCode) {
      return this.http
        .get<ICity>(`${this.settings.environment.referencesUrl}City/Get?code=${cityCode}`);
    }
  }

  public getCountry(countryCode: string): Observable<ICountry> {
    if (this.isReferencesUrlAssigned() && countryCode) {
      return this.http
        .get<ICountry>(`${this.settings.environment.referencesUrl}Country/GetByCode/${countryCode}`);
    }
  }

  public getLanguages(): Observable<ILanguage[]> {
    if (this.isReferencesUrlAssigned()) {
      return this.http
        .get<ILanguage[]>(`${this.settings.environment.referencesUrl}Language/GetAll`);
    }
  }

  public getCurrencies(): Observable<ICurrency[]> {
    if (this.isReferencesUrlAssigned()) {
      return this.http
        .get<ICurrency[]>(`${this.settings.environment.referencesUrl}CurrencyTravelport/GetAll`);
    }
  }

  public getPaySumTypes(): Observable<INamedEntity[]> {
    if (this.isReferencesUrlAssigned()) {
      return this.http
        .get<ICurrency[]>(`${this.settings.environment.referencesUrl}PaySumType/GetAll`);
    }
  }

}

import { ElementRef, Inject, Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fromEvent, Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  pluck,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

// interfaces
import { ICoreEnvironment, ICountry, IQueryResult } from '../interfaces';

// env
import { CORE_ENVIRONMENT } from '../lib/h21-company-list/core-environment.token';

@Injectable()
export class CountriesAutocompleteService implements OnDestroy {

  private _displayFnCountries: ICountry[] = [];
  private _destroy$ = new Subject<boolean>();

  constructor(
    private _http: HttpClient,
    @Inject(CORE_ENVIRONMENT) private _core: ICoreEnvironment,
  ) {}

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public getCountryName(countryCode): string {
    return this._displayFnCountries.find(({ code }) => code === countryCode).name;
  }

  public getCountry(countryCode: string): Observable<ICountry> {
    return this._getCountry(countryCode)
      .pipe(
        tap((country) => this._displayFnCountries.push(country)),
        takeUntil(this._destroy$),
      );
  }

  public getCountries(input: ElementRef): Observable<ICountry[]> {
    const isAutocompleteBooker = (country) => country && typeof country !== 'string';
    const keyupFilter = (event: any) => event.target.value.length > 1;

    return fromEvent(input.nativeElement, 'keyup')
      .pipe(
        debounceTime(300),
        filter(keyupFilter),
        map((event: KeyboardEvent) => (<HTMLInputElement>event.target).value),
        distinctUntilChanged(),
        map((country: any) => isAutocompleteBooker(country) ? country.name : country),
        switchMap<string, ICountry[]>((country: string) => this._getCountries(country)),
        tap((countries) => this._displayFnCountries = countries),
      );
  }

  private _getCountries(nameContains: string): Observable<ICountry[]> {
    const body = { filter: { nameContains }, withCount: false };
    return this._http.post<IQueryResult<ICountry>>(`${this._core.referencesUrl}Country/PostQuery`, body)
      .pipe(pluck('items'));
  }

  private _getCountry(code: string): Observable<ICountry> {
    return this._http.get<ICountry>(`${this._core.referencesUrl}Country/GetByCode/${code}`);
  }

}

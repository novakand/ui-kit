import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IRequestOptions } from '../../../interfaces/request-options.interface';
import { ThemeProfile } from '../models/theme-profile.model';
import { H21ThemeApiService } from './h21-theme-api.service';
import { Query } from '../../../models/query.model';
import { pluck } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class H21ThemeProfileService {

  private _model = 'WhiteLabelProfile';

  constructor(private _http: H21ThemeApiService) { }

  public getById(profileId: number, options?: IRequestOptions): Observable<ThemeProfile> {
    return this._http.getEntity<ThemeProfile>(this._model, profileId, options);
  }

  public getCurrentProfile(): Observable<ThemeProfile> {
    return this._http.getApi<ThemeProfile>(`${this._model}/GetCurrentProfile`);
  }

  public find(filter: Query<any>, options?: IRequestOptions): Observable<ThemeProfile[]> {
    return this._http.postQuery<ThemeProfile>(this._model, filter, options)
      .pipe(
        pluck('items'),
      );
  }

}

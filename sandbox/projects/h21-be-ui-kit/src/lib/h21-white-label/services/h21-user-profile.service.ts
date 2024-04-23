import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IQueryResult } from '../../../interfaces/query-result.interface';
import { IRequestOptions } from '../../../interfaces/request-options.interface';
import { UserProfile } from '../../../models/user-profile.model';
import { H21ThemeApiService } from './h21-theme-api.service';
import { Query } from '../../../models/query.model';

@Injectable({
  providedIn: 'root',
})
export class H21UserProfileService {

  private _model = 'UserProfile';

  constructor(private _http: H21ThemeApiService) { }

  public find(filter: Query<any>, options?: IRequestOptions): Observable<IQueryResult<UserProfile>> {
    return this._http.postQuery<UserProfile>(this._model, filter, options);
  }

}

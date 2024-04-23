import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

// interfaces
import { IProfileLink, IQueryResult, IRequestOptions } from '../interfaces';
import { ICompanyProfile } from '../lib/h21-company-list/interfaces';

// models
import { ProfileLinkFilter, Query } from '../models';

// services
import { HttpClientService } from './http-client.service';
import { SettingsService } from './settings.service';

@Injectable()
export class ProfileLinkService extends HttpClientService {

  private _entity = 'ProfileLink';
  private _apiUrl = this.settingsService.environment.profileApi;

  constructor(http: HttpClient,
              settingsService: SettingsService,
  ) {
    super(http, settingsService);
  }

  public postApi<T>(url: string, body: any, options?: IRequestOptions): Observable<T> {
    return this.post<T>(`${this._apiUrl}${url}`, body, options);
  }

  public getList(filter: Query<ProfileLinkFilter>): Observable<IQueryResult<IProfileLink>> {
    return this.postQuery(this._entity, filter);
  }

  public getProfile(ids: number[]): Observable<ICompanyProfile[]> {
    const filter = new Query({
      filter: {
        typeIdIn: ids,
        isForSelectCompany: true,
      },
      withCount: false,
    });
    return this.postApi(`${this._entity}/PostQuery`, filter)
      .pipe(
        pluck('items'),
      );
  }

}

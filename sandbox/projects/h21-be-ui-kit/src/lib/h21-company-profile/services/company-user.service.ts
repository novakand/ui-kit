import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

// services
import { HttpClientService } from '../../../services/http-client.service';
import { SettingsService } from '../../../services/settings.service';

// models
import { UsersFilter } from '../components/users/users-filter.model';
import { Query } from '../../../models';

// interfaces
import { ICompanyUser } from '../interfaces/company-user.interface';
import { IQueryResult, IRequestOptions } from '../../../interfaces';

@Injectable()
export class CompanyUserService extends HttpClientService {

  private _entity = 'UserProfileLink';
  private _apiUrl = this.settingsService.environment.profileApi;

  constructor(http: HttpClient,
              settingsService: SettingsService,
  ) {
    super(http, settingsService);
  }

  public getList(filter: Query<UsersFilter>): Observable<IQueryResult<ICompanyUser>> {
    return this.postQuery(this._entity, filter);
  }

  public addUser(user: ICompanyUser): Observable<ICompanyUser> {
    return this.post(`${this._apiUrl}CompanyProfileUsers/Add`, user);
  }

  public deleteUser(user: ICompanyUser): Observable<Response> {
    return this.postDelete(this._entity, user);
  }

  public getApi<T>(url: string, options?: IRequestOptions | null): Observable<T> {
    return this.get<T>(`${this._apiUrl}${url}`, options);
  }

  public postApi<T>(url: string, body: any, options?: IRequestOptions): Observable<T> {
    return this.post<T>(`${this._apiUrl}${url}`, body, options);
  }

}

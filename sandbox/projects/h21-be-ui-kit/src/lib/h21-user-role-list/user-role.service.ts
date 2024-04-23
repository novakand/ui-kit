import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

// external operators
import { Observable } from 'rxjs';

// enums
import { Application } from '../../enums';

// services
import { HttpClientService } from '../../services/http-client.service';
import { SettingsService } from '../../services/settings.service';

// interfaces
import { ICoreEnvironment } from '../../interfaces/core-environment.interface';
import { IQueryResult } from '../../interfaces/query-result.interface';
import { IRequestOptions } from '../../interfaces/request-options.interface';
import { IUserRoleList } from './user-role-list.interface';

// models
import { UserRole } from './user-role.model';
import { Query } from '../../models/query.model';

// tokens
import { CORE_ENVIRONMENT } from '../h21-company-list/core-environment.token';

@Injectable()
export class UserRoleService extends HttpClientService {

  private _entity = 'UserProfileLink';
  private _apiUrl = this.settingsService.environment.profileApi;

  constructor(http: HttpClient,
              settingsService: SettingsService,
              @Inject(CORE_ENVIRONMENT) private _core: ICoreEnvironment,
  ) {
    super(http, settingsService);
  }

  public getUserRoleList(userProfileId: number): Observable<IQueryResult<IUserRoleList>> {
    const filter = new Query<any>({
      filter: {
        userProfileId: userProfileId,
      },
      withCount: false,
    });
    this._core.application !== Application.ADMIN_OFFICE && (filter.filter.application = this._core.application);
    this._filterByApp(filter);
    return this.postApi<IQueryResult<IUserRoleList>>(`${this._entity}/RolePostQuery`, filter);
  }

  public save(role: UserRole): Observable<UserRole> {
    return this.postEntity(this._entity, role);
  }

  public postApi<T>(url: string, body: any, options?: IRequestOptions): Observable<T> {
    return this.post<T>(`${this._apiUrl}${url}`, body, options);
  }

  private _filterByApp(filter: Query<any>): void {
    const curApp = this.settingsService.environment.application;
    if (Application.AGENT_OFFICE === curApp) {
      filter.filter.application = Application.AGENT_OFFICE;
    }
  }

}

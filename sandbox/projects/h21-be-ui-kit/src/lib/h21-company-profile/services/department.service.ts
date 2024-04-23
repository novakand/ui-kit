import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { pluck } from 'rxjs/operators';
import { Observable } from 'rxjs';

// services
import { HttpClientService } from '../../../services/http-client.service';
import { SettingsService } from '../../../services/settings.service';

// models
import { DepartmentFilter } from '../components/departments/models/department-filter.model';
import { Query } from '../../../models';

// interfaces
import { IDepartment } from '../components/departments/interfaces/department.interface';
import { IQueryResult, IRequestOptions } from '../../../interfaces';
import { TravelerFilter } from '../components/departments/models';
import { ITraveler } from '../interfaces/traveler.interface';

@Injectable()
export class DepartmentService extends HttpClientService {

  private _entity = 'Department';

  constructor(http: HttpClient,
              settingsService: SettingsService,
  ) {
    super(http, settingsService);
  }

  public getList(filter: Query<DepartmentFilter>): Observable<IQueryResult<IDepartment>> {
    return this.postQuery(this._entity, filter);
  }

  public getTravellers(filter: Query<TravelerFilter>): Observable<ITraveler[]> {
    return this.postQuery('TravelerProfile', filter)
      .pipe(
        pluck('items'),
      );
  }

  public getDepartment(id: number): Observable<IDepartment> {
    return this.getEntity(this._entity, id);
  }

  public saveDepartment(department: IDepartment): Observable<IDepartment> {
    return this.postEntity(this._entity, department);
  }

  public deleteDepartment(department: IDepartment): Observable<Response> {
    return this.postDelete(this._entity, department);
  }

  public getApi<T>(url: string, options?: IRequestOptions | null): Observable<T> {
    return this.get<T>(`${this.settingsService.environment.profileApi}${url}`, options);
  }

  public postApi<T>(url: string, body: any, options?: IRequestOptions): Observable<T> {
    return this.post<T>(`${this.settingsService.environment.profileApi}${url}`, body, options);
  }

}

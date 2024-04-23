import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// rxjs
import { pluck } from 'rxjs/operators';
import { Observable } from 'rxjs';

// models
import { ProfileProviderFilter } from '../models';
import { Query } from '../../../../../models';

// interfaces
import { IProfileProvider, IProfileProviderSetting } from '../interfaces';
import { IQueryResult } from '../../../../../interfaces';

// services
import { SettingsService } from '../../../../../services/settings.service';

@Injectable()
export class ProfileProviderService {

  private _entity = 'CompanyProfileProvider';

  constructor(
    private _http: HttpClient,
    private _settings: SettingsService,
  ) { }

  public getByFilter(filter: Query<ProfileProviderFilter>): Observable<IQueryResult<IProfileProvider>> {
    return this._http.post<IQueryResult<IProfileProvider>>(
      `${this._settings.environment.profileApi}${this._entity}/PostQuery`,
      filter,
    ).pipe(pluck('items'));
  }

  public getSettingByCompanyId(id: number): Observable<IProfileProviderSetting> {
    return this._http.get<IProfileProviderSetting>(
      `${this._settings.environment.profileApi}CompanyProfileProviderSetting/GetEntityByCompany?companyId=${id}`,
    );
  }

  public saveSetting(setting: IProfileProviderSetting): Observable<IProfileProviderSetting> {
    return this._http.post<IProfileProviderSetting>(
      `${this._settings.environment.profileApi}CompanyProfileProviderSetting/PostEntity`,
      setting,
    );
  }

  public resetSetting(setting: IProfileProviderSetting): Observable<IProfileProviderSetting> {
    return this._http.post<IProfileProviderSetting>(
      `${this._settings.environment.profileApi}CompanyProfileProviderSetting/Reset`,
      setting,
    );
  }

  public updateEnable(id: number, state: boolean): Observable<void> {
    return this._http.post<void>(
      `${this._settings.environment.profileApi}${this._entity}/UpdateEnable`,
      { id: id, state: state },
    );
  }

}

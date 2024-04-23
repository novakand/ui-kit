import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { OAuthService } from 'angular-oauth2-oidc';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// enums
import { Application } from '../../../enums/application.enum';

// services
import { SettingsService } from '../../../services/settings.service';

// tokens
import { CORE_ENVIRONMENT } from '../../h21-company-list/core-environment.token';

// interfaces
import { ICompanyProfile } from '../../h21-company-list/interfaces/company-profile.interface';
import { ICoreEnvironment } from '../../../interfaces/core-environment.interface';
import { IIdentityClaims } from '../../../interfaces/identity-claims.interface';
import { CompanyRole } from '../enums';

// models
import { CompanyProfileSetting } from './../company-profile-setting.model';

@Injectable()
export class CompanySettingService {

  private _entity = 'UserProfileSetting';
  private _globalAdminRole = 'admin';
  private _baseUrl = `${this._settingsService.environment.profileApi}${this._entity}`;

  constructor(private _http: HttpClient,
              private _auth: OAuthService,
              private _settingsService: SettingsService,
              @Inject(CORE_ENVIRONMENT) public core: ICoreEnvironment,
  ) { }

  public getSetting(): Observable<CompanyProfileSetting> {
    return this._http.get<CompanyProfileSetting>(`${this._baseUrl}/GetSettings`)
      .pipe(
        map((setting) => new CompanyProfileSetting(setting)),
      );
  }

  public isAdmin(): Observable<boolean> {
    const _adminRoles = ['admin', 'HM', 'HO'];
    return this._http.get<CompanyProfileSetting>(`${this._baseUrl}/GetSettings`)
    .pipe(
      map((setting) => {
        switch (this.core.application) {
          case Application.AGENT_OFFICE:
            if (!setting.agentofficeRoles) {
              return false;
            }
            return setting.agentofficeRoles.includes(CompanyRole.admin) || this.isAdminByClaims();
          case Application.BACK_OFFICE:
            if (!setting.backofficeRoles) {
              return false;
            }
            return _adminRoles.some((role) => setting.backofficeRoles.includes(role)) || this.isAdminByClaims();
          default:
            return true;
        }
      }),
    );
  }

  public isAdminInCompany(): Observable<boolean> {
    return this._http.get<CompanyProfileSetting>(`${this._baseUrl}/GetSettings`)
    .pipe(
      map((setting) => {
        switch (this.core.application) {
          case Application.AGENT_OFFICE:
            if (!setting.agentofficeRoles) {
              return false;
            }
            return this.isAdminByClaims() || setting.agentofficeRoles.includes(CompanyRole.admin);
          case Application.BACK_OFFICE:
            if (!setting.backofficeRoles) {
              return false;
            }
            return this.isAdminByClaims() || setting.backofficeRoles.includes(CompanyRole.admin);
          default:
            return true;
        }
      }),
    );
  }

  public getProfile(id: number): Observable<ICompanyProfile> {
    return this._http.get<ICompanyProfile>(`${this._settingsService.environment.profileApi}CompanyProfile/GetEntity?id=${id}`);
  }

  public saveSetting(profileSetting: CompanyProfileSetting): Observable<CompanyProfileSetting> {
    return this._http.post<CompanyProfileSetting>(`${this._baseUrl}/SaveSettings`, profileSetting)
      .pipe(
        map((setting) => new CompanyProfileSetting(setting)),
      );
  }

  public isAdminByClaims(): boolean {
    const role = this._getClaims().role;
    return !!(role && role.includes(this._globalAdminRole));
  }

  private _getClaims(): IIdentityClaims {
    return <IIdentityClaims>this._auth.getIdentityClaims();
  }

}

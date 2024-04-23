import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { pluck } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

// services
import { CompanyUserRoleService } from '../../services/company-user-roles.service';
import { HttpClientService } from '../../services/http-client.service';
import { SettingsService } from '../../services/settings.service';

// interfaces
import { INamedEntity } from '../../interfaces/named-entity.interface';
import { IQueryResult } from '../../interfaces/query-result.interface';
import { ICompanyProfileLink } from './company-profile-link.interface';
import { ICoreEnvironment } from '../../interfaces';

// models
import { UserProfileLink } from './user-profile-link.model';
import { Query } from '../../models/query.model';

// enums
import { ProfileType } from './profile-type';
import { Application } from '../../enums';

// tokens
import { CORE_ENVIRONMENT } from '../h21-company-list/core-environment.token';

@Injectable()
export class LinkDialogService extends HttpClientService {

  private _profileUrl = this.settingsService.environment.profileApi;
  private _companyListUrl = `${this._profileUrl}CompanyProfile/PostQuery`;
  private _companyUrl = `${this._profileUrl}CompanyProfile/GetEntity`;
  private _userProfileLinkUrl = `${this._profileUrl}UserProfileLink/PostEntity`;
  private _getUserProfileLinkUrl = `${this._profileUrl}UserProfileLink/GetEntity`;

  constructor(http: HttpClient,
              settingsService: SettingsService,
              @Inject(CORE_ENVIRONMENT) private _core: ICoreEnvironment,
  ) {
    super(http, settingsService);
  }

  public getCompanies(searchText: string): Observable<ICompanyProfileLink[]> {
    const filter = new Query<any>({
      filter: {
        searchExp: searchText,
        typeIdNotEqual: ProfileType.PROVIDER,
      },
      withCount: false,
    });
    this._core.application !== Application.ADMIN_OFFICE && (filter.filter.application = this._core.application);
    return this.post<IQueryResult<ICompanyProfileLink>>(this._companyListUrl, filter)
      .pipe(
        pluck('items'),
      );
  }

  public getUserProfileLink(id: number): Observable<UserProfileLink> {
    return this.get(`${this._getUserProfileLinkUrl}?id=${id}`);
  }

  public getCompanyProfile(id: number): Observable<ICompanyProfileLink> {
    return this.get(`${this._companyUrl}?id=${id}`);
  }

  public getRoles(typeId: number): Observable<INamedEntity[]> {
    return of(CompanyUserRoleService.getRoles(typeId));
  }

  public saveUserProfileLink(data: UserProfileLink): Observable<UserProfileLink> {
    return this.post(this._userProfileLinkUrl, data);
  }

}

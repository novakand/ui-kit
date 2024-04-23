import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

// interfaces
import { IRequestOptions } from '../../../../interfaces/request-options.interface';

// services
import { HttpClientService } from '../../../../services/http-client.service';
import { SettingsService } from '../../../../services/settings.service';

@Injectable()
export class IdentityUserProfileService extends HttpClientService {

  private _entityName = 'IdentityUserProfile';

  constructor(http: HttpClient,
              settingsService: SettingsService,
  ) {
    super(http, settingsService);
  }

  public confirmEmailOnIdentity(email: string, companyProfileId?: number): Observable<unknown> {
    const companyProfileParam = !companyProfileId ? '' : `&companyProfileId=${companyProfileId}`;
    return this.getApi(`${this._entityName}/SendEmailConfirm?email=${email}${companyProfileParam}`);
  }

  public getApi<T>(url: string, options?: IRequestOptions): Observable<T> {
    return this.get<T>(`${this.settingsService.environment.profileApi}${url}`, options);
  }

}

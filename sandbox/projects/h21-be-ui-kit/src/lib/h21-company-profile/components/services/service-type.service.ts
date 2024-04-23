import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// external libs
import { map, pluck } from 'rxjs/operators';
import { Observable } from 'rxjs';

// services
import { SettingsService } from '../../../../services/settings.service';

// models
import { CompanyServiceType } from './company-service-type.model';
import { Query } from '../../../../models/query.model';

// interfaces
import { IServiceType } from './service-type.interface';

@Injectable()
export class ServiceTypeService {

  constructor(private _http: HttpClient,
              private _settings: SettingsService,
  ) { }

  public getTypes(): Observable<IServiceType[]> {
    const url = `${this._settings.environment.referencesUrl}ServiceType/PostQuery`;
    return this._http.post<IServiceType[]>(url, { withCount: false })
      .pipe(
        pluck('items'),
        map((list: IServiceType[]) => {
          return list.map((item) => {
            item.isDefault = false;
            return item;
          });
        }),
      );
  }

  public getCompanyTypes(companyId: number): Observable<CompanyServiceType[]> {
    const url = `${this._settings.environment.profileApi}CompanyProfileService/PostQuery`;
    return this._http.post<CompanyServiceType[]>(url, new Query({
      filter: {
        companyProfileId: companyId,
      },
      withCount: false,
    }))
    .pipe(
      pluck('items'),
    );
  }

}

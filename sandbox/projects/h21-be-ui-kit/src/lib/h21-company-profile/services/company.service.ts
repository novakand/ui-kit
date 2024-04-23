import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// rxjs
import { Observable } from 'rxjs';

// services
import { HttpClientService } from '../../../services/http-client.service';
import { SettingsService } from '../../../services/settings.service';

// interfaces
import { IReferencesList } from '../components/company-references/interfaces/references.list.interface';
import { IReference, IReferencesFilter } from '../components/company-references/interfaces';
import { IQueryResult, IRequestOptions } from '../../../interfaces';
import { ICompany } from './../interfaces/company.interface';

// models
import { UpdateReferences } from '../components/company-references/models/references.models';
import { Query } from '../../../models';

@Injectable()
export class CompanyService extends HttpClientService {

  private _entity = 'CompanyProfile';

  constructor(http: HttpClient,
              settingsService: SettingsService,
  ) {
    super(http, settingsService);
  }

  public getCompany(id: number): Observable<ICompany> {
    return this.getEntity(this._entity, id);
  }

  public getCompanyContract(id: number): Observable<ICompany> {
    return this.postApi(this._entity, id);
  }

  public getApi<T>(url: string, options?: IRequestOptions | null): Observable<T> {
    return this.get<T>(`${this.settingsService.environment.profileApi}${url}`, options);
  }

  public postApi<T>(url: string, body: any, options?: IRequestOptions): Observable<T> {
    return this.post<T>(`${this.settingsService.environment.profileApi}${url}`, body, options);
  }

  public save(company: ICompany): Observable<ICompany> {
    return this.postEntity(this._entity, company);
  }

  public getCompanyReferences(company: Query<IReferencesFilter>): Observable<IQueryResult<IReferencesList>> {
    return this.postQuery('CompanyReference', company);
  }

  public updateReference(state: UpdateReferences, path: string): Observable<void> {
    return this.postApi(`CompanyReference/${path}`, state);
  }

  public saveReference(item: IReference): Observable<IReference> {
    return this.postApi('CompanyReference/PostEntity', item);
  }

  public getReference(id: number): Observable<IReference> {
    return this.getEntity('CompanyReference', id);
  }

}

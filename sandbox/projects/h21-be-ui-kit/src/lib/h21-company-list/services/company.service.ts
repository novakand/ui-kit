import { Inject, Injectable } from '@angular/core';

import { map, pluck } from 'rxjs/operators';
import { Observable } from 'rxjs';

// enums
import { Application, EntityState } from '../../../enums';

import { ICodeNamedEntity, ICoreEnvironment, IQueryResult, IRequestOptions, } from '../../../interfaces';

// services
import { HttpClientService } from '../../../services/http-client.service';
import { CompanyFilter } from '../components/company-filter';

// tokens
import { CORE_ENVIRONMENT } from '../core-environment.token';

// interfaces
import {
  ICompanyAddress,
  ICompanyAddressList,
  ICompanyBankAccount,
  ICompanyBankAccountList,
  ICompanyContact,
  ICompanyNote,
  ICompanyProfile,
  ICompanyProfileList,
  IPaymentReference
} from '../interfaces';

// models
import {
  CompanyActualContract,
  CompanyState,
  CompanyVersion,
} from '../models';
import { Query, QueryBase } from '../../../models/query.model';
import { CompanyType } from '../../h21-header/company-type.enum';

@Injectable()
export class CompanyService {

  private _companyBaseUrl = `${this.core.referencesUrl}Company/`;
  private _contactBaseUrl = `${this.core.referencesUrl}CompanyContact/`;
  private _companyPaymentMethodBaseUrl = `${this.core.referencesUrl}CompanyPaymentMethod/`;
  private _noteBaseUrl = `${this.core.referencesUrl}CompanyNote/`;
  private _addressBaseUrl = `${this.core.referencesUrl}CompanyAddress/`;
  private _stateBaseUrl = `${this.core.referencesUrl}State/`;

  private _companyActualStates: CompanyActualContract[] = [
    { id: 1, name: 'Active', hasActualContract: true },
    { id: 2, name: 'Not active', hasActualContract: false },
  ];

  constructor(private _http: HttpClientService,
              @Inject(CORE_ENVIRONMENT) public core: ICoreEnvironment,
  ) { }

  //#region Company
  public companyPostQuery(query: QueryBase, options?: IRequestOptions): Observable<IQueryResult<ICompanyProfileList>> {
    return this._http.post<IQueryResult<ICompanyProfile>>(`${this._companyBaseUrl}PostQuery`, query, options);
  }

  public getParentCompanies(currentId: number): Observable<ICompanyProfile[]> {
    const filter = new Query<CompanyFilter>({
      withCount: false,
      filter: { typeIdIn: [CompanyType.H21G, CompanyType.H21B], idNotEqual: currentId },
    });

    return this._http.post<IQueryResult<ICompanyProfile>>(`${this._companyBaseUrl}PostQuery`, filter)
      .pipe(
        pluck('items'),
      );
  }

  public companyGetEntity(entityId: number, options?: IRequestOptions): Observable<ICompanyProfile> {
    return this._http.get<ICompanyProfile>(`${this._companyBaseUrl}GetEntity?id=${entityId}`, options);
  }

  public companyPostEntity(entity: ICompanyProfile, options?: IRequestOptions): Observable<ICompanyProfile> {
    return this._http.post<ICompanyProfile>(`${this._companyBaseUrl}PostEntity`, entity, options);
  }

  public companyPublish(entity: ICompanyProfile, options?: IRequestOptions): Observable<ICompanyProfile> {
    const method = this.core.application === Application.AGENT_OFFICE ? 'PublishClient' : 'Publish';
    return this._http.post<ICompanyProfile>(`${this._companyBaseUrl}${method}`, { id: entity.id }, options);
  }

  public getStateList(queryDto: QueryBase, options?: IRequestOptions): Observable<CompanyState[]> {
    return this.statePostQuery(queryDto, options)
      .pipe(map((queryResult) => queryResult.items.map((state) => new CompanyState(state))));
  }

  public statePostQuery(queryDto: Query<{}>, options?: IRequestOptions): Observable<IQueryResult<ICodeNamedEntity>> {
    return this._http.post<IQueryResult<ICodeNamedEntity>>(`${this._stateBaseUrl}PostQuery`, queryDto, options);
  }

  public getVersionList(queryDto: QueryBase, options?: IRequestOptions): Observable<CompanyVersion[]> {
    return this.companyPostQuery(queryDto, options)
      .pipe(
        map((result) => result.items
          .map((company) => new CompanyVersion(company)),
        ),
      );
  }

  public getCompanyActualContractStates(): CompanyActualContract[] {
    return this._companyActualStates;
  }

  public getHasCompanyActualContractName(hasActualContract: boolean): CompanyActualContract {
    return this.getCompanyActualContractStates().find((state) => state.hasActualContract === hasActualContract);
  }
  //#endregion

  //#region Contact
  public contactPostQuery(queryDto: QueryBase, options?: IRequestOptions): Observable<IQueryResult<ICompanyContact>> {
    return this._http.post<IQueryResult<ICompanyContact>>(`${this._contactBaseUrl}PostQuery`, queryDto, options);
  }

  public contactGetEntity(entityId: number, options?: IRequestOptions): Observable<ICompanyContact> {
    return this._http.get<ICompanyContact>(`${this._contactBaseUrl}GetEntity?id=${entityId}`, options);
  }

  public contactPostEntity(entity: ICompanyContact, options?: IRequestOptions): Observable<ICompanyContact> {
    return this._http.post<ICompanyContact>(`${this._contactBaseUrl}PostEntity`, entity, options);
  }

  public contactPostDelete(entity: ICompanyContact, options?: IRequestOptions): Observable<{}> {
    return this._http.post(`${this._contactBaseUrl}PostDelete`, entity, options);
  }
  //#endregion

  //#region Сompany Payment Method
  public bankAccountPostQuery(companyId?: number, options?: IRequestOptions): Observable<IQueryResult<ICompanyBankAccountList>> {
    const queryDto = this._getBankAccountFilter(companyId || -1);
    return this._http.post<IQueryResult<ICompanyBankAccountList>>(`${this._companyPaymentMethodBaseUrl}PostQuery`, queryDto, options);
  }

  public searchByAccountNumber(companyId?: number, accountNumber: string = null): Observable<IQueryResult<ICompanyBankAccountList>> {
    const filter = this._getBankAccountFilter(companyId || -1, accountNumber);
    return this._http.post<IQueryResult<ICompanyBankAccountList>>(`${this._companyPaymentMethodBaseUrl}PostQuery`, filter);
  }

  public bankAccountGetEntity(entityId: number, options?: IRequestOptions): Observable<ICompanyBankAccount> {
    return this._http.get<ICompanyBankAccount>(`${this._companyPaymentMethodBaseUrl}GetEntity?id=${entityId}`, options);
  }

  public bankAccountPostEntity(entity: ICompanyBankAccount, options?: IRequestOptions): Observable<ICompanyBankAccount> {
    return this._http.post<ICompanyBankAccount>(`${this._companyPaymentMethodBaseUrl}PostEntity`, entity, options);
  }

  public bankAccountPostDelete(entity: ICompanyBankAccount, options?: IRequestOptions): Observable<{}> {
    return this._http.post(`${this._companyPaymentMethodBaseUrl}PostDelete`, entity, options);
  }

  public getPaymentStateList(query: Query<{}>, options?: IRequestOptions): Observable<ICodeNamedEntity[]> {
    return this.statePostQuery(query, options)
      .pipe(map((queryResult) => queryResult.items.map((state: ICodeNamedEntity) => state)));
  }

  //#endregion

  //#region Note
  public notePostQuery(queryDto: QueryBase, options?: IRequestOptions): Observable<IQueryResult<ICompanyNote>> {
    return this._http.post<IQueryResult<ICompanyNote>>(`${this._noteBaseUrl}PostQuery`, queryDto, options);
  }

  public noteGetEntity(entityId: number, options?: IRequestOptions): Observable<ICompanyNote> {
    return this._http.get<ICompanyNote>(`${this._noteBaseUrl}GetEntity?id=${entityId}`, options);
  }

  public notePostEntity(entity: ICompanyNote, options?: IRequestOptions): Observable<ICompanyNote> {
    return this._http.post<ICompanyNote>(`${this._noteBaseUrl}PostEntity`, entity, options);
  }

  public notePostDelete(entity: ICompanyNote, options?: IRequestOptions): Observable<{}> {
    return this._http.post(`${this._noteBaseUrl}PostDelete`, entity, options);
  }
  //#endregion

  //#region Address
  public addressPostQuery(queryDto: QueryBase, options?: IRequestOptions): Observable<IQueryResult<ICompanyAddressList>> {
    return this._http.post<IQueryResult<ICompanyAddressList>>(`${this._addressBaseUrl}PostQuery`, queryDto, options);
  }

  public addressGetEntity(entityId: number, options?: IRequestOptions): Observable<ICompanyAddress> {
    return this._http.get<ICompanyAddress>(`${this._addressBaseUrl}GetEntity?id=${entityId}`, options);
  }

  public addressPostEntity(entity: ICompanyAddress, options?: IRequestOptions): Observable<ICompanyAddress> {
    return this._http.post<ICompanyAddress>(`${this._addressBaseUrl}PostEntity`, entity, options);
  }

  public addressPostDelete(entity: ICompanyAddress, options?: IRequestOptions): Observable<{}> {
    return this._http.post(`${this._addressBaseUrl}PostDelete`, entity, options);
  }
  //#endregion

  public getSubstituteParameters(): Observable<ICodeNamedEntity[]> {
    const filter = new Query<any>({ withCount: false });
    const url = `${this.core.referencesUrl}SubstituteParameter/PostQuery`;
    return this._http.post<IQueryResult<ICodeNamedEntity>>(url, filter).pipe(pluck('items'));
  }

  public getCardReferenceList(paymentTypeId: number): Observable<ICodeNamedEntity[]> {
    const filter = new Query<any>({
      filter: { paymentTypeId: paymentTypeId },
      withCount: false,
    });
    const url = `${this.core.referencesUrl}CardReference/PostQuery`;
    return this._http.post<IQueryResult<ICodeNamedEntity>>(url, filter).pipe(pluck('items'));
  }

  // todo выпилить и написать нормально
  private _getBankAccountFilter(companyId: number, accountNumber: string = null): any {
    return {
      filter: {
        companyId: companyId || -1,
        accountNumber: accountNumber,
        entityStateIn: [EntityState.ACTUAL, EntityState.ACTUAL_VERSION, EntityState.VERSION],
      },
      withCount: true,
    };
  }

}

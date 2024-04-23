import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// models
import { CompanyListPageState } from './models';
import { CompanyFilter } from './components/company-filter';

@Injectable()
export class CompanyListStorageService {

  public companyPageState = new BehaviorSubject(new CompanyListPageState(new CompanyFilter()));

}

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class StoreService<T, U extends T[]> {

  public read$: Observable<U>;
  public create$: Observable<T>;
  public update$: Observable<void>;
  public delete$: Observable<void>;
  public error$: Observable<HttpErrorResponse>;

  protected createSubject: BehaviorSubject<T>;
  protected readSubject: BehaviorSubject<U>;
  protected updateSubject: BehaviorSubject<void>;
  protected deleteSubject: BehaviorSubject<void>;
  protected errorSubject: BehaviorSubject<HttpErrorResponse>;

}

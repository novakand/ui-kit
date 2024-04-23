import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IRequestOptions } from '../interfaces/request-options.interface';
import { IQueryResult } from '../interfaces/query-result.interface';
import { HttpClientService } from './http-client.service';
import { QueryBase } from '../models/query.model';

@Injectable()
export class MockHttpClientService extends HttpClientService {

  public get<T>(url: string, options?: IRequestOptions | null): Observable<T> {
    return this._mockData$.asObservable();
  }

  public getBlob(url: string): Observable<Blob> {
    return this._mockData$.asObservable();
  }

  public getApi<T>(url: string, options?: IRequestOptions | null): Observable<T> {
    return this.get<T>(null, options);
  }

  public getEntity<T>(entityName: string, entityId: number, options?: IRequestOptions | null): Observable<T> {
    return this.getApi<T>(`${entityName}/GetEntity?id=${entityId}`, options);
  }

  public find<T>(url: string,
                 options?: IRequestOptions): Observable<T> {
    return this.get<T>(url, options);
  }

  public post<T>(url: string, body: any, options?: IRequestOptions): Observable<T> {
    return this._mockData$.asObservable();
  }

  public postApi<T>(url: string, body: any, options?: IRequestOptions): Observable<T> {
    return this.post<T>(null, body, options);
  }

  public postQuery<T>(entityName: string,
                      queryDto: QueryBase,
                      options?: IRequestOptions): Observable<IQueryResult<T>> {
    return this.postApi<IQueryResult<T>>(`${entityName}/PostQuery`, queryDto, options);
  }

  public postSearch<T>(entityName: string,
                       queryDto: QueryBase,
                       options?: IRequestOptions): Observable<IQueryResult<T>> {
    return this.postApi<IQueryResult<T>>(`${entityName}/PostSearch`, queryDto, options);
  }

  public postEntity<T>(entityName: string,
                       entity: T,
                       options?: IRequestOptions): Observable<T> {
    return this.postApi<T>(`${entityName}/PostEntity`, entity, options);
  }

  public postDelete(entityName: string,
                    body: any,
                    options?: IRequestOptions): Observable<Response> {
    return this.postApi<Response>(`${entityName}/PostDelete`, body, options);
  }

  public put<T>(url: string, body: any, options?: IRequestOptions): Observable<T> {
    return this._mockData$.asObservable();
  }

  public delete(url: string, options?: IRequestOptions): Observable<any> {
    return this._mockData$.asObservable();
  }

  public downloadFile(id: number): Observable<Blob> {
    return this._mockData$.asObservable();
  }

  public downloadFileByHash(hash: string, name?: string, folder?: string): Observable<Blob> {
    return this.getBlob(null);
  }

  public downloadFileByClick(hash: string, name: string): void { }

  public upload<T>(url: string, formData: FormData): Observable<T> {
    return this._mockData$.asObservable();
  }

}

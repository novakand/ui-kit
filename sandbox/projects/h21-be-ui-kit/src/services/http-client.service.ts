import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { SettingsService } from './settings.service';

import { IRequestOptions } from '../interfaces/request-options.interface';
import { IQueryResult } from '../interfaces/query-result.interface';
import { QueryBase } from '../models/query.model';

@Injectable()
export class HttpClientService {

  protected _mockData$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  set mockData$(value: unknown) { this._mockData$.next(value); }

  constructor(private _http: HttpClient,
              protected settingsService: SettingsService,
  ) { }

  public get<T>(url: string, options?: IRequestOptions | null): Observable<T> {
    options = options || {};

    options.withCredentials = true;

    return this._http.get<T>(url, options);
  }

  public getBlob(url: string): Observable<Blob> {
    return this._http.get(url, { responseType: 'blob' });
  }

  public getApi<T>(url: string, options?: IRequestOptions | null): Observable<T> {
    return this.get<T>(`${this.settingsService.environment.apiRootUrl}${url}`, options);
  }

  public getEntity<T>(entityName: string,
                      entityId: number,
                      options?: IRequestOptions | null): Observable<T> {
    return this.getApi<T>(`${entityName}/GetEntity?id=${entityId}`, options);
  }

  public find<T>(url: string,
                 options?: IRequestOptions): Observable<T> {
    return this.get<T>(url, options);
  }

  public post<T>(url: string, body: any, options?: IRequestOptions): Observable<T> {
    options = this._getDefaultOptions(options);

    return this._http.post<T>(url, JSON.stringify(body), options);
  }

  public postApi<T>(url: string, body: any, options?: IRequestOptions): Observable<T> {
    return this.post<T>(`${this.settingsService.environment.apiRootUrl}${url}`, body, options);
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
    options = this._getDefaultOptions(options);

    return this._http.put<T>(url, JSON.stringify(body), options);
  }

  public delete(url: string, options?: IRequestOptions): Observable<any> {
    return this._http.delete(url, options);
  }

  public downloadFile(id: number): Observable<Blob> {
    return this._http.get(
      `${this.settingsService.environment.fileStorageUrl}GetDownload?id=${id}`,
      {
        withCredentials: true,
        responseType: 'blob',
      });
  }

  public downloadFileByHash(hash: string, name?: string, folder?: string): Observable<Blob> {
    let url = `${this.settingsService.environment.fileStorageUrl}GetDownload?hash=${hash}`;

    if (name) {
      url += `&name=${name}`;
    }

    if (folder) {
      url += `&folder=${folder}`;
    }

    return this.getBlob(url);
  }

  public downloadFileByClick(hash: string, name: string, folder?: string): void {
    this.downloadFileByHash(hash, name, folder)
      .subscribe((e: Blob) => {
        const url = window.URL.createObjectURL(e);
        const a: any = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

  public upload<T>(url: string, formData: FormData): Observable<T> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this._http.post<T>(url, formData, {
      responseType: 'json',
      headers,
    });
  }

  private _getDefaultOptions(options?: IRequestOptions): IRequestOptions {
    options = options || {};
    options.headers = options.headers || new HttpHeaders({ 'Content-Type': 'application/json' });
    options.withCredentials = true;
    return options;
  }

}

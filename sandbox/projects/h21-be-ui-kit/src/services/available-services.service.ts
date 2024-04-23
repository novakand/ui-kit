import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

// external libs
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';

// services
import { SettingsService } from './settings.service';

// interfaces
import { IAppDetails } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AvailableServicesService {

  private _entity = 'ServiceAvailability';

  constructor(private _http: HttpClient,
              private _auth: OAuthService,
              private _settings: SettingsService,
  ) { }

  public getAvailableServices(): Observable<IAppDetails[]> {
    const params = new HttpParams().set('clientId', this._auth.clientId);
    return this._http.get<IAppDetails[]>(`${this._settings.environment.apiRootUrl}${this._entity}`, { params: params });
  }

}

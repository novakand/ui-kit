import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  OAuthResourceServerErrorHandler,
  OAuthService,
  OAuthStorage,
} from 'angular-oauth2-oidc';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

// services
import { SettingsService } from '../../../services/settings.service';

@Injectable({
  providedIn: 'root',
})
export class H21AuthInterceptor implements HttpInterceptor {

  constructor(private _storage: OAuthStorage,
              private _settings: SettingsService,
              private _oauthService: OAuthService,
              private _errorHandler: OAuthResourceServerErrorHandler,
  ) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.headers.get('skip')) {
      if (this._oauthService.hasValidAccessToken()) {
        const token = this._oauthService.getAccessToken() || this._storage.getItem('access_token');
        const header = `Bearer ${token}`;

        const headers = req.headers.set('Authorization', header)
                        .set('h21ApplicationType', `${this._settings.environment.application}`);

        req = req.clone({ headers });
      } else {
        this._oauthService.initImplicitFlow();
      }
    }

    return next
    .handle(req)
    .pipe(catchError((err) => this._errorHandler.handleError(err)));
  }

}

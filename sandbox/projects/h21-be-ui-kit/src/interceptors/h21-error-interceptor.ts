import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { NavigationExtras, Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { OAuthService } from 'angular-oauth2-oidc';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { H21DefaultDialogService } from '../lib/dialogs/h21-default-dialog.service';
import { ErrorDetails } from '../models/error-details.model';
import { IconType } from '../lib/dialogs/enums/icon-type';

@Injectable()
export class H21ErrorInterceptor implements HttpInterceptor {

  constructor(private _router: Router,
              private _oauthService: OAuthService,
              private _dialog: H21DefaultDialogService,
  ) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(request)
      .pipe(catchError((response: HttpErrorResponse) => {
        const detail: ErrorDetails = new ErrorDetails({
          errorCode: response.status,
          title: response.error.state,
          text: response.error.message,
        });

        switch (response.status) {
          case 401:
            if (this._oauthService.hasValidAccessToken()) {
              this._oauthService.initImplicitFlow();
            }
            return;
          case 422:
            this._dialog.message(detail.title, detail.text, IconType.Error);
            break;
          case 0:
            // ignore this type of errors
            break;
          default:
            const extras: NavigationExtras = {
              queryParams: {
                errorDetails: JSON.stringify(detail),
              },
            };

            this._router.navigate(['error'], extras);
            break;
        }

        return throwError(response);
      }));
  }

}

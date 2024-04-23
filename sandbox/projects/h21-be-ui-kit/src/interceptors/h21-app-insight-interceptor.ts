import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AppInsightsService } from '@markpieszak/ng-application-insights';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class H21AppInsightInterceptor implements HttpInterceptor {

  constructor(private _appInsightsService: AppInsightsService) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(request)
      .pipe(catchError((response: HttpErrorResponse) => {
        this._appInsightsService.trackException(response.error);
        return throwError(response);
      }));
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HttpClientService } from '../../../services/http-client.service';
import { SettingsService } from '../../../services/settings.service';
import { IRequestOptions } from '../../../interfaces/request-options.interface';
import { ExportTheme } from '../models/export-theme.model';

@Injectable({
  providedIn: 'root',
})
export class H21ThemeApiService extends HttpClientService {

  constructor(http: HttpClient,
              settingsService: SettingsService,
  ) {
    super(http, settingsService);
  }

  public getApi<T>(url: string, options?: IRequestOptions | null): Observable<T> {
    return this.get<T>(`${this.settingsService.environment.profileApi}${url}`, options);
  }

  public postApi<T>(url: string, body: any, options?: IRequestOptions): Observable<T> {
    return this.post<T>(`${this.settingsService.environment.profileApi}${url}`, body, options);
  }

  public uploadTheme(profile: ExportTheme, options?: IRequestOptions): Observable<ExportTheme> {
    return this.postApi<ExportTheme>('WhiteLabelUpload/UploadProfile', profile, options);
  }

}

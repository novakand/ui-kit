import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { IRequestOptions } from '../../../interfaces/request-options.interface';
import { H21ThemeApiService } from './h21-theme-api.service';
import { ExportTheme } from '../models/export-theme.model';

@Injectable({
  providedIn: 'root',
})
export class H21ThemeImportService {

  private _imported$ = new Subject<void>();

  get imported$(): Observable<void> {
    return this._imported$;
  }

  constructor(private _http: H21ThemeApiService) { }

  public importTheme(e: Event): void {
    const fileList: FileList = (<HTMLInputElement>e.target).files;

    const reader = new FileReader();
    reader.readAsText(fileList[0], 'UTF-8');

    reader.onload = (evt: ProgressEvent) => {
      const file = <FileReader>evt.target;
      const theme: ExportTheme = JSON.parse(<string>file.result);
      this.upload(theme).subscribe({ next: () => this._imported$.next() });
    };
  }

  public upload(theme: ExportTheme, options?: IRequestOptions): Observable<ExportTheme> {
    return this._http.uploadTheme(theme, options);
  }

}

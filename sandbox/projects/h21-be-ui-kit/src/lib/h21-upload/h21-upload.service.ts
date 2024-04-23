import {
  HttpClient,
  HttpEventType,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { IFileDictionary } from './file-dictionary';

@Injectable({
  providedIn: 'root',
})
export class H21UploadService {

  constructor(private http: HttpClient) { }

  public upload(url: string, files: Set<File>): IFileDictionary {
    const status: IFileDictionary = {};

    files.forEach((file) => {
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);

      const req = new HttpRequest('POST', url, formData, { reportProgress: true });

      const progress$ = new Subject<number>();

      this.http.request(req)
        .subscribe({
          next: (event) => {
            if (event.type === HttpEventType.UploadProgress) {
              const percentDone = Math.round(event.loaded / event.total * 100);
              progress$.next(percentDone);
            } else if (event instanceof HttpResponse) {
              progress$.complete();
            }
          },
        });

      status[file.name] = {
        progress: progress$.asObservable(),
      };
    });

    return status;
  }

}

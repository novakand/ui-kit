import { Injectable } from '@angular/core';

import { forkJoin, Observable } from 'rxjs';

import { HttpClientService } from './http-client.service';

import { IFileSizeCompareResult } from '../interfaces/file-size-compare-result.interface';
import { IFileSizeCompare } from '../interfaces/file-size-compare.interface';
import { IFileInfo } from '../interfaces/file-info.interface';

@Injectable({
  providedIn: 'root',
})
export class FileUploaderService {

  constructor(private _http: HttpClientService) { }

  public uploadFileList(url: string, files: FileList): Observable<IFileInfo[]> | null {
    if (files && files.length > 0) {
      const observables: Observable<IFileInfo>[] = [];

      Array.from(files).forEach((file) => {
        const formData: FormData = new FormData();
        formData.append(file.name, file);
        observables.push(this._http.upload<IFileInfo>(url, formData));
      });

      return forkJoin(observables);
    }

    return null;
  }

  public upload(url: string, e: Event): Observable<IFileInfo> | null {
    if (this._isHTML5()) {
      return this._xhrTransport(url, e);
    }
  }

  public checkFileFormat(files: FileList, fileFormats: string[]): boolean {
    return fileFormats.indexOf(files.item(0).type) > -1;
  }

  public checkFileSize(files: FileList, sizeRule: IFileSizeCompare): IFileSizeCompareResult {

    const result: IFileSizeCompareResult = { isCorrect: true };
    const currentSizeKb = files.item(0).size / 1024;

    if (sizeRule) {
      if (!sizeRule.maxSize && !sizeRule.minSize) {
        result.isCorrect = true;
      } else if (sizeRule.maxSize && sizeRule.minSize) {
        result.isCorrect = currentSizeKb <= sizeRule.maxSize && currentSizeKb >= sizeRule.minSize;
        if (!result.isCorrect) {
          result.message = `The file size should not be less than ${sizeRule.minSize}KB and not more ${sizeRule.maxSize}KB`;
        }
      } else if (sizeRule.maxSize) {
        result.isCorrect = currentSizeKb <= sizeRule.maxSize;
        if (!result.isCorrect) {
          result.message = `The file size should not be more than ${sizeRule.maxSize}KB`;
        }
      } else {
        result.isCorrect = currentSizeKb >= sizeRule.minSize;
        if (!result.isCorrect) {
          result.message = `The file size should not be less than ${sizeRule.minSize}KB`;
        }
      }
    }
    return result;
  }

  public checkFilesExtension(files: FileList, acceptableExtensions: string[]): boolean {
    let isCorrectFiles = true;
    Array.from(files).forEach((file) => {
      if (isCorrectFiles) { isCorrectFiles = acceptableExtensions.findIndex((ext) => file.name.endsWith(ext) === true) !== -1;  }
    });
    return isCorrectFiles;
  }

  public checkFilesSize(files: FileList, sizeRule: IFileSizeCompare): boolean {
    let isCorrectFiles = true;
    Array.from(files).forEach((file) => {
      if (isCorrectFiles) {
        isCorrectFiles = file.size > 0 &&
          (!sizeRule.minSize || file.size >= sizeRule.minSize) && ((!sizeRule.maxSize || file.size <= sizeRule.maxSize));
      }
    });
    return isCorrectFiles;
  }

  private _isHTML5(): boolean {
    return !!(this._window().File && this._window().FormData);
  }

  private _xhrTransport(url: string, e: Event): Observable<IFileInfo> | null {
    const fileList: FileList = (<HTMLInputElement>e.target).files;

    if (fileList.length > 0) {
      const file: File = fileList[0];
      const formData: FormData = new FormData();

      formData.append('image', file, file.name);
      return this._http.upload<IFileInfo>(url, formData);
    }
    return null;
  }

  private _window(): any {
    return window;
  }

}

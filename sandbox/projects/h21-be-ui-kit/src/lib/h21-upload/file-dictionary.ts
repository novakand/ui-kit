import { Observable } from 'rxjs';

export interface IFileDictionary {
  [key: string]: IFileProgress;
}

export interface IFileProgress {
  file?: File;
  progress?: Observable<number>;
}

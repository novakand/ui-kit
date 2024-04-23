import { Observable, Subject } from 'rxjs';

export class ControlWrapper<T> {

  public wrapper: Subject<boolean>;
  public request: Observable<T>;

  constructor(obj: Partial<ControlWrapper<T>>) {
    Object.assign(this, obj);
  }

}

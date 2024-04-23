import { Injectable } from '@angular/core';

import { debounceTime, switchMap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';

import { ControlWrapper } from '../models';

@Injectable({
  providedIn: 'root',
})
export class HttpControlService {

  public wrap<T, V>(request: Observable<T>, debounce?: number): ControlWrapper<T> {
    const wrapper$: Subject<boolean> = new Subject<boolean>();

    const request$ = wrapper$
      .pipe(
        debounceTime(debounce),
        switchMap((condition) => condition ? request : of()),
      );

    return new ControlWrapper({
      wrapper: wrapper$,
      request: request$,
    });
  }

}

import { Injectable, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { Theme } from '../models/theme.model';

@Injectable({
  providedIn: 'root',
})
export class H21ProfileSaverService implements OnDestroy {

  private _currentTheme = new Subject<Theme>();
  private _saveSuccess = new Subject<boolean>();

  get currentTheme(): Observable<Theme> {
    return this._currentTheme.asObservable();
  }

  get panelClose(): Observable<boolean> {
    return this._saveSuccess.asObservable();
  }

  public ngOnDestroy(): void {
    this._saveSuccess.complete();
    this._currentTheme.complete();
  }

  public emitCurrentTheme(theme: Theme): void {
    this._currentTheme.next(theme);
  }

  public emitCloseWlPanel(closePanel: boolean): void {
    this._saveSuccess.next(closePanel);
  }

}

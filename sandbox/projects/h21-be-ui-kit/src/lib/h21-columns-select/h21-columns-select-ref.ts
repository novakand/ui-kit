import { OverlayRef } from '@angular/cdk/overlay';

import { filter, take } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { H21ColumnsSelectComponent } from './h21-columns-select.component';

import { IH21Column } from '../h21-table/h21-column.interfaces';

export class H21ColumnsSelectRef {

  public componentInstance: H21ColumnsSelectComponent;

  private _beforeClose$ = new Subject<void>();
  private _afterClosed$ = new Subject<any>();

  constructor(private _overlayRef: OverlayRef) { }

  get afterClosed$(): Observable<any> {
    return this._afterClosed$.asObservable();
  }

  get beforeClose$(): Observable<void> {
    return this._beforeClose$.asObservable();
  }

  public close(data: IH21Column[] | null = null): void {
    this.componentInstance.animationStateChanged
      .pipe(
        filter((event: any) => event.phaseName === 'start'),
        take(1),
      )
      .subscribe({
        next: () => {
          this._beforeClose$.next();
          this._beforeClose$.complete();
          this._overlayRef.detachBackdrop();
        },
      });

    this.componentInstance.animationStateChanged
      .pipe(
        filter((event: any) => event.phaseName === 'done' && event.toState === 'leave'),
        take(1),
      )
      .subscribe({
        next: () => {
          this._overlayRef.dispose();
          this._afterClosed$.next(data);
          this._afterClosed$.complete();
          this.componentInstance = null;
        },
      });

    this.componentInstance.startExitAnimation();
  }

}

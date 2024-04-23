import { OverlayRef } from '@angular/cdk/overlay';

import { filter, take } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { H21AccountSelectComponent } from './h21-account-select.component';

export class H21AccountSelectRef {

  public componentInstance: H21AccountSelectComponent;

  private _afterClosed = new Subject<any>();
  private _beforeClose = new Subject<void>();

  constructor(private overlayRef: OverlayRef) { }

  public close(data: any = null): void {
    this.componentInstance.animationStateChanged.pipe(
      filter((event: any) => event.phaseName === 'start'),
      take(1),
    ).subscribe({
      next: () => {
        this._beforeClose.next();
        this._beforeClose.complete();
        this.overlayRef.detachBackdrop();
      },
    });

    this.componentInstance.animationStateChanged.pipe(
      filter((event: any) => event.phaseName === 'done' && event.toState === 'leave'),
      take(1),
    ).subscribe({
      next: () => {
        this.overlayRef.dispose();
        this._afterClosed.next(data);
        this._afterClosed.complete();
        this.componentInstance = null;
      },
    });

    this.componentInstance.startExitAnimation();
  }

  public afterClosed(): Observable<any> {
    return this._afterClosed.asObservable();
  }

  public beforeClose(): Observable<void> {
    return this._beforeClose.asObservable();
  }

}

import { OverlayRef } from '@angular/cdk/overlay';

import { filter, take } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { H21NotificationListDialogComponent } from './h21-notification-list-dialog.component';

export class H21NotificationListDialogRef {

  public componentInstance: H21NotificationListDialogComponent;

  private _beforeClose = new Subject<void>();
  private _afterClosed = new Subject<any>();

  constructor(private _overlayRef: OverlayRef) { }

  public close(data?: any): void {
    this.componentInstance.animationStateChanged.pipe(
      filter((event: any) => event.phaseName === 'start'),
      take(1),
    ).subscribe({
      next: () => {
        this._beforeClose.next();
        this._beforeClose.complete();
        this._overlayRef.detachBackdrop();
      },
    });

    this.componentInstance.animationStateChanged.pipe(
      filter((event: any) => event.phaseName === 'done' && event.toState === 'leave'),
      take(1),
    ).subscribe({
      next: () => {
        this._overlayRef.dispose();
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

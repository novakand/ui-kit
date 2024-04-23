import { OverlayRef } from '@angular/cdk/overlay';

import { filter, take } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { H21RightOverlayPanelComponent } from './h21-right-overlay-panel.component';

export class H21RightOverlayPanelRef {

  public componentInstance: H21RightOverlayPanelComponent;

  private _beforeClose = new Subject<void>();
  private _afterClosed = new Subject<void>();

  constructor(private overlayRef: OverlayRef) { }

  public close(): void {
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
        this._afterClosed.next();
        this._afterClosed.complete();
        this.componentInstance = null;
      },
    });

    this.componentInstance.startExitAnimation();
  }

  public afterClosed(): Observable<void> {
    return this._afterClosed.asObservable();
  }

  public beforeClose(): Observable<void> {
    return this._beforeClose.asObservable();
  }

}

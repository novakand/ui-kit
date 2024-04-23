import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { H21CompanySelectPanelComponent } from './h21-company-select-panel.component';

export class H21CompanySelectPanelRef {

  public componentInstance: H21CompanySelectPanelComponent;
  private _afterClosed = new Subject<any>();
  private _beforeClose = new Subject<void>();

  constructor(private _overlayRef: OverlayRef) { }

  public afterClosed(): Observable<any> {
    return this._afterClosed.asObservable();
  }

  public beforeClosed(): Observable<any> {
    return this._beforeClose.asObservable();
  }

  public close(data?: any | null): void {
    this.componentInstance.animationStateChanged.pipe(
      filter((event: any) => event.phaseName === 'start'),
      take(1),
    ).subscribe(() => {
      this._beforeClose.next();
      this._beforeClose.complete();
      this._overlayRef.detachBackdrop();
    });

    this.componentInstance.animationStateChanged.pipe(
      filter((event: any) => event.phaseName === 'done' && event.toState === 'leave'),
      take(1),
    ).subscribe(() => {
      this._overlayRef.dispose();
      this._afterClosed.next(data);
      this._afterClosed.complete();
      this.componentInstance = null;
    });

    this.componentInstance.startExitAnimation();
  }

}

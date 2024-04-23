import { OverlayRef } from '@angular/cdk/overlay';

import { filter, take } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

// components
import { CompanyContactEditComponent } from './company-contact-edit.component';

// interfaces
import { ICompanyContact } from '../../../interfaces';

export class CompanyContactEditRef {

  public componentInstance: CompanyContactEditComponent;

  private _beforeClose = new Subject<void>();
  private _afterClosed = new Subject<any>();

  constructor(private _overlayRef: OverlayRef) { }

  get afterClosed(): Observable<any> {
    return this._afterClosed.asObservable();
  }

  get beforeClose(): Observable<void> {
    return this._beforeClose.asObservable();
  }

  public close(data: ICompanyContact | null = null): void {
    this.componentInstance.animationStateChanged
      .pipe(
        filter((event: any) => event.phaseName === 'start'),
        take(1),
      )
      .subscribe({
        next: () => {
          this._beforeClose.next();
          this._beforeClose.complete();
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
          this._afterClosed.next(data);
          this._afterClosed.complete();
          this.componentInstance = null;
        },
      });

    this.componentInstance.startExitAnimation();
  }

}

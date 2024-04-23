import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Injector } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';

import { H21NotificationListDialogComponent } from './h21-notification-list-dialog.component';
import { H21NotificationListDialogRef } from './h21-notification-list-dialog-ref';
import { DIALOG_DATA } from './h21-notification-list-dialog.tokens';
import { IH21Notification } from '../../../models';

@Injectable()
export class H21NotificationListDialogService {

  constructor(private _overlay: Overlay,
              private _injector: Injector,
  ) { }

  public open(data: IH21Notification[]): H21NotificationListDialogRef  {
    const overlayRef = this._overlay.create(this.getOverlayConfig());
    const dialogRef = new H21NotificationListDialogRef(overlayRef);

    const injectionTokens = new WeakMap();
    injectionTokens.set(H21NotificationListDialogRef, dialogRef);
    injectionTokens.set(DIALOG_DATA, data);

    const injector = new PortalInjector(this._injector, injectionTokens);
    const containerPortal = new ComponentPortal(H21NotificationListDialogComponent, null, injector);
    const containerRef: ComponentRef<H21NotificationListDialogComponent> = overlayRef.attach(containerPortal);
    dialogRef.componentInstance = containerRef.instance;

    // close dialog on backdrop click
    if (overlayRef.getConfig().hasBackdrop) {
      overlayRef.backdropClick()
        .subscribe({
          next: () => {
            dialogRef.close();
          },
        });
    }

    return dialogRef;
  }

  public getOverlayConfig(): OverlayConfig {
    const width = '550px';
    return {
      width: width,
      maxWidth: width,
      minWidth: width,
      height: '100%',
      minHeight: '100%',
      maxHeight: '100%',
      positionStrategy: this._overlay.position().global(). right('0'),
      scrollStrategy: this._overlay.scrollStrategies.block(),
      hasBackdrop: true,
      backdropClass: 'h21-dialog-panel_transparent-backdrop',
      panelClass: 'h21-dialog-panel_panel',
    };
  }

}

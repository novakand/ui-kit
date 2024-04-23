import { ComponentRef, Injectable, Injector } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { DIALOG_DATA } from './h21-user-profile-panel.tokens';
import { H21UserProfilePanelComponent } from './h21-user-profile-panel.component';
import { H21UserProfilePanelRef } from './h21-user-profile-panel-ref';

@Injectable()
export class H21UserProfilePanelService {

  constructor(
    private _injector: Injector,
    private _overlay: Overlay,
  ) {

  }

  public open(data: any = null): H21UserProfilePanelRef {
    const overlayRef = this._overlay.create(this._getOverlayConfig());
    const dialogRef = new H21UserProfilePanelRef(overlayRef);
    const injectionTokens = new WeakMap();
    injectionTokens.set(H21UserProfilePanelRef, dialogRef);
    injectionTokens.set(DIALOG_DATA, data);
    const injector = new PortalInjector(this._injector, injectionTokens);
    const containerPortal = new ComponentPortal(H21UserProfilePanelComponent, null, injector);
    const containerRef: ComponentRef<H21UserProfilePanelComponent> = overlayRef.attach(containerPortal);
    dialogRef.componentInstance = containerRef.instance;

    if (overlayRef.getConfig().hasBackdrop) {
      overlayRef.backdropClick().subscribe(() => {
        dialogRef.close();
      });
    }

    overlayRef.keydownEvents().subscribe((event) => {
      if (event.code === 'Escape') {
        dialogRef.close();
      }
    });

    return dialogRef;
  }

  private _getOverlayConfig(): OverlayConfig {
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

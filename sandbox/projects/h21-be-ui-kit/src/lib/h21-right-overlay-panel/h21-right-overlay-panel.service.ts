import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Injector } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';

import { H21RightOverlayPanelComponent } from './h21-right-overlay-panel.component';
import { H21RightOverlayPanelRef } from './h21-right-overlay-panel-ref';

@Injectable()
export class H21RightOverlayPanelService {

  private _overlayConfig = {
    backdropClass: 'c-h21-right-overlay-panel-box',
    hasBackdrop: true,
    width: '100%',
    height: '100%',
    panelClass: '',
  };

  constructor(private overlay: Overlay,
              private injector: Injector,
  ) { }

  public open(componentType: string): void {
    const overlayRef = this.overlay.create(this._overlayConfig);
    const dialogRef = new H21RightOverlayPanelRef(overlayRef);

    const injectionTokens = new WeakMap();
    injectionTokens.set(H21RightOverlayPanelRef, dialogRef);

    const injector = new PortalInjector(this.injector, injectionTokens);
    const containerPortal = new ComponentPortal(H21RightOverlayPanelComponent, null, injector);
    const containerRef: ComponentRef<H21RightOverlayPanelComponent> = overlayRef.attach(containerPortal);

    dialogRef.componentInstance = containerRef.instance;
    dialogRef.componentInstance.componentType = componentType;
  }

}

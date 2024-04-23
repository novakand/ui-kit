import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Injector } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';

import { H21AccountSelectComponent } from './h21-account-select.component';
import { ACCOUNTS_DIALOG_DATA } from './h21-accounts-select.tokens';
import { H21AccountSelectRef } from './h21-account-select-ref';

@Injectable()
export class H21AccountSelectService {

  public overlayConfig = {
    backdropClass: 'c-h21-right-overlay-panel-box',
    hasBackdrop: true,
    width: '100%',
    height: '100%',
    panelClass: '',
  };

  constructor(private overlay: Overlay,
              private injector: Injector,
  ) { }

  public open(data: any): H21AccountSelectRef  {
    const overlayRef = this.overlay.create(this.overlayConfig);
    const dialogRef = new H21AccountSelectRef(overlayRef);

    const injectionTokens = new WeakMap();
    injectionTokens.set(H21AccountSelectRef, dialogRef);
    injectionTokens.set(ACCOUNTS_DIALOG_DATA, data);

    const injector = new PortalInjector(this.injector, injectionTokens);
    const containerPortal = new ComponentPortal(H21AccountSelectComponent, null, injector);
    const containerRef: ComponentRef<H21AccountSelectComponent> = overlayRef.attach(containerPortal);
    dialogRef.componentInstance = containerRef.instance;

    return dialogRef;
  }

}

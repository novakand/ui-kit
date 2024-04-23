import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Injector } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';

// refs & tokens
import { DIALOG_DATA_CSP } from './tokens/h21-company-select-panel.tokens';
import { H21CompanySelectPanelRef } from './h21-company-select-panel-ref';

// components
import { H21CompanySelectPanelComponent } from './h21-company-select-panel.component';

// models
import { CompanySelectData } from './company-select-data';

@Injectable()
export class H21CompanySelectPanelService {

  constructor(private _overlay: Overlay,
              private _injector: Injector,
  ) { }

  public open(data: CompanySelectData): H21CompanySelectPanelRef {
    const overlayRef = this._overlay.create(this._getOverlayConfig());
    const dialogRef = new H21CompanySelectPanelRef(overlayRef);

    const injectionTokens = new WeakMap();
    injectionTokens.set(H21CompanySelectPanelRef, dialogRef);
    injectionTokens.set(DIALOG_DATA_CSP, data);

    const injector = new PortalInjector(this._injector, injectionTokens);
    const containerPortal = new ComponentPortal(H21CompanySelectPanelComponent, null, injector);
    const containerRef: ComponentRef<H21CompanySelectPanelComponent> = overlayRef.attach(containerPortal);
    dialogRef.componentInstance = containerRef.instance;

    if (overlayRef.getConfig().hasBackdrop) {
      overlayRef.backdropClick().subscribe({
        next: () => {
          dialogRef.close();
        },
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

import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Injector } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';

// components
import { CompanyFilterComponent } from './company-filter.component';

// tokens & refs
import { FILTER_DIALOG_DATA } from './company-filter.tokens';
import { CompanyFilterRef } from './company-filter-ref';

// models
import { CompanyFilter } from './company-filter.model';

@Injectable()
export class CompanyFilterService {

  constructor(private _overlay: Overlay,
              private _injector: Injector,
  ) { }

  public open(data: CompanyFilter): CompanyFilterRef {
    const overlayRef = this._overlay.create(this._getOverlayConfig());
    const dialogRef = new CompanyFilterRef(overlayRef);

    const injectionTokens = new WeakMap();
    injectionTokens.set(CompanyFilterRef, dialogRef);
    injectionTokens.set(FILTER_DIALOG_DATA, data);

    const injector = new PortalInjector(this._injector, injectionTokens);
    const containerPortal = new ComponentPortal(CompanyFilterComponent, null, injector);
    const containerRef: ComponentRef<CompanyFilterComponent> = overlayRef.attach(containerPortal);
    dialogRef.componentInstance = containerRef.instance;

    if (overlayRef.getConfig().hasBackdrop) {
      overlayRef.backdropClick()
        .subscribe({ next: () => { dialogRef.close(); } });
    }

    overlayRef.keydownEvents()
      .subscribe({
        next: (event) => {
          event.code === 'Escape' && dialogRef.close();
        },
      });

    return dialogRef;
  }

  private _getOverlayConfig(): OverlayConfig {
    const width = '575px';
    return {
      width: width,
      maxWidth: width,
      minWidth: width,
      height: '100%',
      minHeight: '100%',
      maxHeight: '100%',
      positionStrategy: this._overlay.position().global().right('0'),
      scrollStrategy: this._overlay.scrollStrategies.block(),
      hasBackdrop: true,
      backdropClass: 'h21-dialog-panel_transparent-backdrop',
      panelClass: 'h21-dialog-panel_panel',
    };
  }

}

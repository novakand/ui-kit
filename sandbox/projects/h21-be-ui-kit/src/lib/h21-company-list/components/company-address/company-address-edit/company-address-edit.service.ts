import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Injector } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';

// components
import { CompanyAddressEditComponent } from './company-address-edit.component';

// tokens & refs
import { COMPANY_ADDRESS_EDIT_DIALOG_DATA } from './company-address-edit.tokens';
import { CompanyAddressEditRef } from './company-address-edit-ref';

// interfaces
import { ICompanyAddress } from '../../../interfaces';

@Injectable()
export class CompanyAddressEditService {

  constructor(private _injector: Injector,
              private _overlay: Overlay,
  ) { }

  public open(data: ICompanyAddress): CompanyAddressEditRef {
    const overlayRef = this._overlay.create(this.getOverlayConfig());
    const dialogRef = new CompanyAddressEditRef(overlayRef);

    const injectionTokens = new WeakMap();
    injectionTokens.set(CompanyAddressEditRef, dialogRef);
    injectionTokens.set(COMPANY_ADDRESS_EDIT_DIALOG_DATA, data);

    const injector = new PortalInjector(this._injector, injectionTokens);
    const containerPortal = new ComponentPortal(CompanyAddressEditComponent, null, injector);
    const containerRef: ComponentRef<CompanyAddressEditComponent> = overlayRef.attach(containerPortal);
    dialogRef.componentInstance = containerRef.instance;

    if (overlayRef.getConfig().hasBackdrop) {
      overlayRef.backdropClick()
        .subscribe({ next: () => { dialogRef.close(); } });
    }

    overlayRef.keydownEvents().subscribe((event) => {
      if (event.code === 'Escape') {
        dialogRef.close();
      }
    });

    return dialogRef;
  }

  public getOverlayConfig(): OverlayConfig {
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

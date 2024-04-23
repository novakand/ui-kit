import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Injector } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';

// components
import { CompanyContactEditComponent } from './company-contact-edit.component';

// tokens & refs
import { COMPANY_CONTACT_DIALOG_DATA } from './company-contact-edit.tokens';
import { CompanyContactEditRef } from './company-contact-edit-ref';

// interfaces
import { ICompanyContact } from '../../../interfaces';

@Injectable()
export class CompanyContactEditService {

  constructor(private _injector: Injector,
              private _overlay: Overlay,
  ) { }

  public open(data: ICompanyContact): CompanyContactEditRef {
    const overlayRef = this._overlay.create(this._getOverlayConfig());
    const dialogRef = new CompanyContactEditRef(overlayRef);
    const injectionTokens = new WeakMap();
    injectionTokens.set(CompanyContactEditRef, dialogRef);
    injectionTokens.set(COMPANY_CONTACT_DIALOG_DATA, data);
    const injector = new PortalInjector(this._injector, injectionTokens);
    const containerPortal = new ComponentPortal(CompanyContactEditComponent, null, injector);
    const containerRef: ComponentRef<CompanyContactEditComponent> = overlayRef.attach(containerPortal);
    dialogRef.componentInstance = containerRef.instance;

    // close dialog on backdrop click
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

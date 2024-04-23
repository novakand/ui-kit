import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Injector } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';

// components
import { CompanyNoteEditComponent } from './company-note-edit.component';

// tokens & refs
import { COMPANY_NOTE_EDIT_DIALOG_DATA } from './company-note-edit.tokens';
import { CompanyNoteEditRef } from './company-note-edit-ref';

// interfaces
import { ICompanyNote } from '../../../interfaces';

@Injectable()
export class CompanyNoteEditService {

  constructor(private _overlay: Overlay,
              private _injector: Injector,
  ) { }

  public open(data: ICompanyNote): CompanyNoteEditRef {
    const overlayRef = this._overlay.create(this._getOverlayConfig());
    const dialogRef = new CompanyNoteEditRef(overlayRef);

    const injectionTokens = new WeakMap();
    injectionTokens.set(CompanyNoteEditRef, dialogRef);
    injectionTokens.set(COMPANY_NOTE_EDIT_DIALOG_DATA, data);

    const injector = new PortalInjector(this._injector, injectionTokens);
    const containerPortal = new ComponentPortal(CompanyNoteEditComponent, null, injector);
    const containerRef: ComponentRef<CompanyNoteEditComponent> = overlayRef.attach(containerPortal);
    dialogRef.componentInstance = containerRef.instance;

    if (overlayRef.getConfig().hasBackdrop) {
      overlayRef.backdropClick()
        .subscribe({ next: () => { dialogRef.close(); } });
    }

    overlayRef.keydownEvents()
      .subscribe({ next: (event) => { event.code === 'Escape' && dialogRef.close(); } });

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

import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Injector } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';

import { H21ColumnsSelectComponent } from './h21-columns-select.component';
import { H21ColumnsSelectRef } from './h21-columns-select-ref';
import { COLUMNS_DATA } from './h21-columns-select.tokens';
import { IColumn } from '../../interfaces';

@Injectable()
export class H21ColumnsSelectService {

  constructor(private _injector: Injector,
              private _overlay: Overlay,
  ) { }

  public open(data: IColumn[]): H21ColumnsSelectRef  {
    const overlayRef = this._overlay.create(this.getOverlayConfig());
    const dialogRef = new H21ColumnsSelectRef(overlayRef);

    const injectionTokens = new WeakMap();
    injectionTokens.set(H21ColumnsSelectRef, dialogRef);
    injectionTokens.set(COLUMNS_DATA, data);

    const injector = new PortalInjector(this._injector, injectionTokens);
    const containerPortal = new ComponentPortal(H21ColumnsSelectComponent, null, injector);
    const containerRef: ComponentRef<H21ColumnsSelectComponent> = overlayRef.attach(containerPortal);
    dialogRef.componentInstance = containerRef.instance;

    if (overlayRef.getConfig().hasBackdrop) {
      overlayRef.backdropClick().subscribe(() => { dialogRef.close(); });
    }

    overlayRef.keydownEvents().subscribe((event) => {
      if (event.code === 'Escape') {
        dialogRef.close();
      }
    });

    return dialogRef;
  }

  public getOverlayConfig(): OverlayConfig {
    const width = '400px';
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

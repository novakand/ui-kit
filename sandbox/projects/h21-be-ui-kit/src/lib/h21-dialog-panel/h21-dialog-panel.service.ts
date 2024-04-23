import { ComponentPortal, ComponentType, PortalInjector } from '@angular/cdk/portal';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { Inject, Injectable, Injector } from '@angular/core';

import { DIALOG_PANEL_COMPONENT, DIALOG_PANEL_DATA } from './h21-dialog-panel.tokens';
import { IH21DialogPanel } from './h21-dialog-panel.interface';

@Injectable()
export class H21DialogPanelService {

  constructor(private _overlay: Overlay,
              private _injector: Injector,
              @Inject(DIALOG_PANEL_DATA) private _config: IH21DialogPanel,
  ) { }

  public open<T>(component: ComponentType<T>, config?: IH21DialogPanel): OverlayRef {

    this._config.data = config.data;
    const injector = new PortalInjector(this._injector, this._getTokens(component));

    const overlayRef = this._overlay.create(this._getOverlayConfig());
    const dialog = new ComponentPortal(component, null, injector);
    overlayRef.attach(dialog);

    overlayRef.backdropClick()
      .subscribe({
        next: () => overlayRef.detach(),
      });

    overlayRef.keydownEvents().subscribe((event) => {
      if (event.code === 'Escape') {
        overlayRef.detach();
      }
    });

    return overlayRef;
  }

  private _getTokens<T>(component: ComponentType<T>): WeakMap<any, any> {
    const injectionTokens = new WeakMap();
    injectionTokens.set(DIALOG_PANEL_COMPONENT, component);

    return injectionTokens;
  }

  private _getOverlayConfig(): OverlayConfig {
    return {
      width: 'auto',
      height: '100%',
      minHeight: '100%',
      maxHeight: '100%',
      hasBackdrop: true,
      backdropClass: 'h21-dialog-panel_transparent-backdrop',
      panelClass: 'h21-dialog-panel_panel',
      scrollStrategy: this._overlay.scrollStrategies.block(),
      positionStrategy: this._overlay.position().global().right('0'),
    };
  }

}

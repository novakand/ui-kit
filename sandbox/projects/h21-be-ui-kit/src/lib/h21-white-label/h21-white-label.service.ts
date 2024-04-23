import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Injector } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';

import { Observable } from 'rxjs';

import { H21WhiteLabelComponent } from './h21-white-label.component';

import { HttpClientService } from '../../services/http-client.service';
import { SettingsService } from '../../services/settings.service';

import { IPublishThemeProfile } from './interfaces/publish-theme-profile.interface';
import { IWhitelabelItem } from './interfaces/whitelabel-item.interface';
import { IQueryResult } from '../../interfaces/query-result.interface';
import { DIALOG_DATA_WL } from './tokens/h21-white-label.token';
import { IThemeItem } from './interfaces/theme-item.interface';
import { H21WhiteLabelRef } from './h21-white-label-ref';
import { QueryBase } from '../../models/query.model';

@Injectable({
  providedIn: 'root',
})
export class H21WhiteLabelService {

  public profileEntityName = 'WhiteLabelProfile';
  public themeEntityName = 'WhiteLabelTheme';

  constructor(private _injector: Injector,
              private _overlay: Overlay,
              private _httpClient: HttpClientService,
              private _settingsService: SettingsService,
  ) { }

  public open(data: any = null): H21WhiteLabelRef {
    const overlayRef = this._overlay.create(this._getOverlayConfig());
    const dialogRef = new H21WhiteLabelRef(overlayRef);
    const injectionTokens = new WeakMap();

    injectionTokens.set(H21WhiteLabelRef, dialogRef);
    injectionTokens.set(DIALOG_DATA_WL, data);

    const injector = new PortalInjector(this._injector, injectionTokens);
    const containerPortal = new ComponentPortal(H21WhiteLabelComponent, null, injector);
    const containerRef: ComponentRef<H21WhiteLabelComponent> = overlayRef.attach(containerPortal);
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

  public getProfileList(queryDto: QueryBase): Observable<IQueryResult<IWhitelabelItem>> {
    return this._httpClient.postQuery<IWhitelabelItem>(this.profileEntityName, queryDto);
  }

  public getProfileListFromProfile(queryDto: QueryBase): Observable<IQueryResult<IWhitelabelItem>> {
    return this._httpClient.post(`${this._settingsService.environment.profileApi}${this.profileEntityName}/PostQuery`, queryDto);
  }

  public getThemeListFromProfile(queryDto: QueryBase): Observable<IQueryResult<IThemeItem>> {
    return this._httpClient.post(`${this._settingsService.environment.profileApi}${this.themeEntityName}/PostQuery`, queryDto);
  }

  public publishProfile(publishThemeProfileDto: IPublishThemeProfile): Observable<IPublishThemeProfile> {
    return this._httpClient
      .post(
        `${this._settingsService.environment.profileApi}${this.profileEntityName}/PostEntity`,
        publishThemeProfileDto);
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
      positionStrategy: this._overlay.position().global().right('0'),
      scrollStrategy: this._overlay.scrollStrategies.block(),
      hasBackdrop: true,
      backdropClass: 'h21-dialog-panel_transparent-backdrop',
      panelClass: 'h21-dialog-panel_panel',
    };
  }

}

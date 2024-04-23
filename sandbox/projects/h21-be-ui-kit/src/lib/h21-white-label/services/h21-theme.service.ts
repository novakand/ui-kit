import { Injectable, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import * as FileSaver from 'file-saver';

import { H21ThemeElementsService } from './h21-theme-elements.service';
import { H21ThemeProfileService } from './h21-theme-profile.service';
import { H21StorageThemeService } from './h21-storage-theme.service';
import { H21ThemeApiService } from './h21-theme-api.service';
import { Utils } from '../../../services/utils';

import { IRequestOptions } from '../../../interfaces/request-options.interface';
import { IQueryResult } from '../../../interfaces/query-result.interface';
import { ThemeProfile } from '../models/theme-profile.model';
import { ExportTheme } from '../models/export-theme.model';
import { Query } from '../../../models/query.model';
import { Theme } from '../models/theme.model';

@Injectable({
  providedIn: 'root',
})
export class H21ThemeService implements OnDestroy {

  private _model = 'WhiteLabelTheme';
  private _themeLoaded = new Subject<Theme>();

  constructor(private _http: H21ThemeApiService,
              private _themeStorageService: H21StorageThemeService,
              private _themeProfileService: H21ThemeProfileService,
              private _themeElementsService: H21ThemeElementsService,
  ) { }

  public ngOnDestroy(): void {
    this._themeLoaded.complete();
  }

  get themeLoaded(): Observable<Theme> {
    return this._themeLoaded.asObservable();
  }

  public applyTheme(): void {
    localStorage.removeItem('theme');

    this._themeProfileService.getCurrentProfile()
    .subscribe({
      next: (profile: ThemeProfile) => {
        profile ? this._getThemeById(profile.id) : this._initByDomain();
      },
    });
  }

  public exportTheme(currentTheme: Theme) {
    const exported = new ExportTheme({
      theme: { ...currentTheme },
      domain: Utils.getAbsoluteDomainUrl(),
      name: currentTheme.name,
    });

    const parts = [JSON.stringify(exported)];
    const blob = new Blob(parts, { type: 'application/json;charset=utf-8' });
    FileSaver.saveAs(blob, `${currentTheme.name}.json`);
  }

  public find(filter: Query<any>, options?: IRequestOptions): Observable<IQueryResult<Theme>> {
    return this._http.postQuery<Theme>(this._model, filter, options);
  }

  public save(theme: Theme): Observable<Theme> {
    return this._http.postEntity<Theme>(this._model, theme);
  }

  public getLogoUrl(theme: Theme, data: Blob): string {
    const isSvg = theme.logoFileName.includes('.svg');
    isSvg && (data = new Blob([data], { type: 'image/svg+xml' }));
    return window.URL.createObjectURL(data);
  }

  private _getThemeById(profileId: number): void {
    this._themeProfileService.getById(profileId)
    .subscribe({
      next: (profile) => {
        if (profile) {
          this._initTheme(profile);
        } else {
          this._initByDomain();
        }
      },
    });
  }

  private _initThemeElements(theme: Theme): void {
    const filter = new Query<any>({
      filter: {
        themeId: theme.id,
      },
    });

    this._themeElementsService.find(filter)
      .subscribe({
        next: (result) => {
          const grouped = this._themeElementsService.groupByThemeId(result.items);
          theme.elements = grouped[theme.id];

          this._themeStorageService.update(theme);
          this._themeLoaded.next(theme);
        },
      });
  }

  private _initTheme(profile: ThemeProfile): void {
    const filter = new Query<any>({
      filter: {
        id: profile.themeId,
      },
    });

    this.find(filter)
      .subscribe({
        next: (result) => {
          const theme = result.items && result.items[0];
          theme ? this._initThemeElements(theme) : this._themeLoaded.next();
        },
      });
  }

  private _initByDomain(): void {
    const filterByDomain = new Query<any>({ filter: { domain: Utils.getAbsoluteDomainUrl() } });

    this._themeProfileService.find(filterByDomain)
      .subscribe({
        next: (profiles) => {
          const thProfile = profiles.length && profiles.find((profile) => !!profile.themeId);
          thProfile && thProfile.enabled ? this._initTheme(thProfile) : this._themeLoaded.next();
        },
      });
  }

}

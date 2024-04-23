import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';

import { H21ProfileSaverService } from '../services/h21-profile-saver.service';
import { H21WhiteLabelService } from '../h21-white-label.service';

import { environment } from '../../../environments/environment';

import { WhiteLabelListAnimation } from '../../../animations/h21-white-label-list';
import { IPublishThemeProfile } from '../interfaces/publish-theme-profile.interface';
import { IIdentityClaims } from '../../../interfaces/identity-claims.interface';
import { IWhitelabelItem } from '../interfaces/whitelabel-item.interface';
import { ISearchEvent } from '../interfaces/search-event.interface';
import { IOrder } from '../../../interfaces/order.interface';
import { WhitelabelTypes } from '../models/whitelabel-types';
import { Query } from '../../../models/query.model';
import { Theme } from '../models/theme.model';
import { IColumn } from '../../../interfaces';

const COLUMNS: IColumn[] = [
  { caption: 'Logo', name: 'logo' },
  { caption: 'WL profile name', name: 'name' },
];

@Component({
  selector: 'h21-white-label-list',
  templateUrl: './h21-white-label-list.component.html',
  animations: WhiteLabelListAnimation,
})
export class H21WhiteLabelListComponent implements OnInit, OnDestroy {

  @Input()
  public loadProfiles = new Subject<void>();

  @Input()
  public reset = new Subject<void>();

  @Output()
  public wlProfileIsSelected = new Subject<boolean>();

  public order: IOrder;
  public totalCount: number;
  public columns: IColumn[];
  public dataSource: IWhitelabelItem[];

  public fakeRows = [1, 2, 3];
  public keyUp = new Subject<ISearchEvent>();

  public inProgress: boolean;
  public hasProgress: boolean;
  public showEnterHint: boolean;

  private _pageSize = 10;
  private _selectedProfile: IWhitelabelItem;
  private _defaultSelectedProfile: IWhitelabelItem;

  private _claims: IIdentityClaims;
  private _wlProfileId: number;

  private _destroy$ = new Subject<void>();

  constructor(private _auth: OAuthService,
              private _saverService: H21ProfileSaverService,
              private _whitelabelService: H21WhiteLabelService,
  ) {
    this.keyUp
      .pipe(
        debounceTime(environment.debouncingTime),
        map((data: ISearchEvent) => {
          this.showEnterHint = data.text.length > 0 && data.text.length < 3;
          return { isEnter: data.event.key === 'Enter', text: data.text };
        }),
        takeUntil(this._destroy$),
      )
      .subscribe({
        next: (x) => {
          if (x.isEnter || x.text.length > 2) {
            this._search(x.text);
          }
        },
      });

    this._saverService.currentTheme
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (theme) => {
          if (theme) {
            this.save(theme);
          }
        },
      });
  }

  public ngOnInit() {
    this.columns = COLUMNS;

    this._claims = <IIdentityClaims> this._auth.getIdentityClaims();

    if (this._claims && this._claims.wl_profile_id) {
      this._wlProfileId = +this._claims.wl_profile_id;
    }

    this.loadProfiles
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          this._search();
        },
      });

    this.reset
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          this.toggleSelected(this._defaultSelectedProfile, true);
        },
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.complete();
  }

  public trackByFn(index) {
    return index;
  }

  public isAdmin(): boolean {
    return this._claims.role && this._claims.role.includes('admin');
  }

  public getWhitelabelType(themeIsDefault: boolean): WhitelabelTypes {
    return WhitelabelTypes[themeIsDefault ? WhitelabelTypes.Standard : WhitelabelTypes.Customized];
  }

  public save(theme: Theme): void {
    if (!this._selectedProfile) {
      return;
    }

    const publishProfile: IPublishThemeProfile = {
      id: this._selectedProfile.id,
      name: this._selectedProfile.name,
      themeId: theme.id,
      description: this._selectedProfile.description,
      enabled: this._selectedProfile.enabled,
      supportContent: this._selectedProfile.supportContent,
      domain: this._selectedProfile.domain,
      userId: null,
      publishTheme: null,
    };

    this._whitelabelService.publishProfile(publishProfile)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (data) => {
          this._selectedProfile = null;
          const panelClose = data.publishTheme.id !== 0;
          this._saverService.emitCloseWlPanel(panelClose);
        },
      });
  }

  public toggleSelected(item: IWhitelabelItem, checked: boolean): void {
    if (checked) {
      this._selectedProfile = item;
      this._selectedProfile.enabled = checked;
    } else {
      this._selectedProfile = null;
    }
    this.wlProfileIsSelected.next(!!this._selectedProfile);
  }

  public isSelected(item: IWhitelabelItem): boolean {
    return this._selectedProfile && this._selectedProfile.id === item.id;
  }

  private _search(pattern?: string, pageIndex?: number) {
    this.inProgress = true;
    this.hasProgress = false;

    this.order = { desc: true, field: 'enabled' };

    const query = new Query<any>({
      withCount: true,
      take: this._pageSize,
      skip: this._pageSize * (pageIndex || 0),
      filter: {
        nameContains: pattern || '',
        withAggregation: true,
      },
      order: this.order ? [this.order] : null,
    });

    this._whitelabelService.getProfileListFromProfile(query)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (data) => {
          this.totalCount = data.count;

          this.dataSource = data.items;

          this._setLinkedWhiteLabelProfileIfExist();

          this.inProgress = false;
          this.hasProgress = true;
        },
      });
  }

  private _setLinkedWhiteLabelProfileIfExist() {
    if (this.dataSource) {
      let iWhitelabelItem: IWhitelabelItem;
      if (this._wlProfileId) {
        iWhitelabelItem = this.dataSource.find((f) => f.id === this._wlProfileId);
      } else {
        iWhitelabelItem = this.dataSource.find((f) => f.domain === window.location.host);
      }
      if (iWhitelabelItem) {
        this.toggleSelected(iWhitelabelItem, true);
        this._defaultSelectedProfile = { ...iWhitelabelItem };
      }
    }
  }

}

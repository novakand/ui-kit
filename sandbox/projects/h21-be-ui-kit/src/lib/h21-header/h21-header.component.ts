import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { OAuthService } from 'angular-oauth2-oidc';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// interfaces
import { ICoreEnvironment } from '../../interfaces/core-environment.interface';

// tokens
import { CORE_ENVIRONMENT } from '../h21-company-list/core-environment.token';

// enums
import { CompanyType } from './company-type.enum';
import { Application } from '../../enums';

// services
import { H21NotificationListDialogService } from './h21-notification-list-dialog/h21-notification-list-dialog.service';
import { H21CompanySelectPanelService } from '../h21-company-select-panel/h21-company-select-panel.service';
import { H21UserProfilePanelService } from '../h21-user-profile-panel/h21-user-profile-panel.service';
import { CompanySettingService } from '../h21-company-profile/services/company-setting.service';
import { H21StorageThemeService } from '../h21-white-label/services/h21-storage-theme.service';
import { UserProfileService } from '../../services/user-profile.service';
import { HttpClientService } from '../../services/http-client.service';
import { SettingsService } from '../../services/settings.service';
import { Utils } from '../../services/utils';

// refs
import { H21NotificationListDialogRef } from './h21-notification-list-dialog/h21-notification-list-dialog-ref';
import { H21CompanySelectPanelRef } from '../h21-company-select-panel/h21-company-select-panel-ref';
import { H21UserProfilePanelRef } from '../h21-user-profile-panel/h21-user-profile-panel-ref';

import { IUserCardAction, IUserCardData } from '../h21-user-profile-panel/models';
import { H21ThemeService } from '../h21-white-label/services/h21-theme.service';
import { IIdentityClaims } from '../../interfaces/identity-claims.interface';

// models
import { CompanySelectData } from '../h21-company-select-panel/company-select-data';
import { IH21Notification } from '../../models/i-h21-notification';
import { Theme } from '../h21-white-label/models/theme.model';
import { UserProfile } from '../../models/user-profile.model';

@Component({
  selector: 'h21-header',
  templateUrl: './h21-header.component.html',
  providers: [
    CompanySettingService,
    H21UserProfilePanelService,
    H21CompanySelectPanelService,
    H21NotificationListDialogService,
  ],
})
export class H21HeaderComponent implements OnInit, OnDestroy {

  @Input() public title: string;
  @Input() public logotypeUrl: string;
  @Input() public isPrototype = false;
  @Input() public notificationCount = 0;
  @Input() public showNotifications = true;
  @Input() public showDashboardLink: boolean;
  @Input() public showServicesMenuBtn = true;
  @Input() public actions: IUserCardAction[] = [];
  @Input() public notifications: IH21Notification[];

  @Output() public logout: EventEmitter<any> = new EventEmitter();
  @Output() public prototypeAuth: EventEmitter<any> = new EventEmitter();
  @Output() public cardAction: EventEmitter<string> = new EventEmitter();
  @Output() public notificationsDialogOpen: EventEmitter<any> = new EventEmitter();
  @Output() public notificationsDialogClose: EventEmitter<any> = new EventEmitter();

  public userName: string;
  public inProcess: boolean;
  public userCardData: IUserCardData;
  public companySelectData: CompanySelectData;

  private _userProfileDialogRef: H21UserProfilePanelRef;
  private _companySelectPanelRef: H21CompanySelectPanelRef;
  private _notificationsDialogRef: H21NotificationListDialogRef;

  private _destroy$ = new Subject<boolean>();

  constructor(private _router: Router,
              public dialog: MatDialog,
              private _auth: OAuthService,
              private _http: HttpClientService,
              private _setting: SettingsService,
              private _themeService: H21ThemeService,
              private _userService: UserProfileService,
              private _settingService: CompanySettingService,
              private _themeStorageService: H21StorageThemeService,
              private _companySelect: H21CompanySelectPanelService,
              private _userProfileDialog: H21UserProfilePanelService,
              @Inject(CORE_ENVIRONMENT) private _core: ICoreEnvironment,
              private _notificationsDialog: H21NotificationListDialogService,
  ) { }

  public ngOnInit(): void {
    if (!!this._userService.getUserProfileId()) {
      this._userService.profile$
        .pipe(
          filter((item) => !!item),
          takeUntil(this._destroy$))
        .subscribe((user) => {
          this._initUserProfilePanelData(user);
        });
    } else {
      this._initUserPanelData();
    }

    this._themeStorageService.themeChanged
      .pipe(takeUntil(this._destroy$))
      .subscribe({ next: (theme) => this._downloadLogo(theme) });

    this._authListeners();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public redirectToDashboard(): void {
    window.open(this._setting.environment.dashboardUrlUri, '_blank');
  }

  public openNotificationsDialog(): void {
    this._notificationsDialogRef = this._notificationsDialog.open(this.notifications);
    this.notificationsDialogOpen.emit();
    this._notificationsDialogRef.afterClosed()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          this.notificationsDialogClose.emit();
        },
      });
  }

  public openUserProfilePanel(): void {
    this.inProcess = true;
    this._getSettings();
  }

  public userCardAction(actionName: string): void {
    this.cardAction.emit(actionName);
  }

  public onLogout(): void {
    if (this._auth.hasValidAccessToken()) {
      this._auth.logOut();
    }

    this.logout.emit();
  }

  private _openCompanySelectPanel(): void {
    this.companySelectData = new CompanySelectData({
      ids: this._getProfileTypes(),
      selected: this.userCardData.profile,
    });
    this._companySelectPanelRef = this._companySelect.open(this.companySelectData);

    this._companySelectPanelRef
      .afterClosed()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          const isChanged = this.companySelectData.isChanged;
          if (isChanged) {
            this._updateSetting();
            this._settingService.saveSetting(this.userCardData.setting)
              .pipe(takeUntil(this._destroy$))
              .subscribe({
                next: () => {
                  this._router.navigate([''])
                  .then(() => { window.location.reload(); });
                },
              });
          }
        },
      });

  }

  private _initUserProfilePanelData(user: UserProfile): void {
    this.userName = this._fillUserName(user);
    this._addLogoutAction();
    this.userCardData = {
      actions: this.actions,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: '',
        position: '',
        email: user.email,
        picture: user.avatar && user.avatar.fileHash,
      },
    };
  }

  private _initUserPanelData(): void {
    const claims = <IIdentityClaims>this._auth.getIdentityClaims();
    this.userName = claims.name;
    this.userCardData = {
      actions: [this._getExitAction()],
      user: {
        firstName: claims.given_name,
        lastName: claims.family_name,
        companyName: '',
        position: '',
        email: claims.email,
        picture: '',
      },
    };
  }

  private _authListeners(): void {
    this._logoutListener();
    this._tokenListener();
  }

  private _logoutListener(): void {
    const logOutEvents = ['token_error', 'token_refresh_error', 'token_validation_error',
      'silent_refresh_error', 'session_error', 'session_terminated'];

    const logOutEvents$ = this._auth.events
    .pipe(
      map((event) => event.type),
      filter((type) => logOutEvents.includes(type)),
      takeUntil(this._destroy$),
    );
    logOutEvents$.subscribe(() => this._auth.logOut());
  }

  private _tokenListener(): void {
    const loadUserProfileEvents = ['token_expires'];

    const tokenEvents$ = this._auth.events
    .pipe(
      map((event) => event.type),
      filter((type) => loadUserProfileEvents.includes(type)),
    );
    tokenEvents$.subscribe({
      next: () => {
        try {
          this._auth.silentRefresh().then(() => this._auth.loadUserProfile());
        } catch (e) { }
      },
    });
  }

  private _downloadLogo(theme: Theme): void {
    theme &&
    theme.logoFileHash &&
    this._http.downloadFileByHash(theme.logoFileHash, '1')
      .subscribe({
        next: (data) => {
          this.logotypeUrl = Utils.getUrlFromBlob(theme.logoFileName, data);
        },
      });
  }

  private _fillUserName(user: UserProfile) {
    if (user.firstName && user.lastName) {
      return `${ user.firstName } ${ user.lastName }`;
    }
    return user.email;
  }

  private _addLogoutAction(): void {
    const index = this.actions.findIndex((item) => {
      return item.name === 'logout';
    });
    if (index < 0) {
      this.actions.push(this._getExitAction());
    }
  }

  private _getExitAction(): IUserCardAction {
    return {
      name: 'logout',
      label: 'Exit',
      icon: 'exit_to_app',
      disabled: false,
      visibility: true,
    };
  }

  private _updateSetting(): void {
    const setting = this.userCardData.setting;
    const selected = this.companySelectData.selected;
    const app = this._setting.environment.application;

    if (Application.BACK_OFFICE === app) {
      setting.backofficeCompanyProfileId = selected.id;
      return;
    }

    setting.agentofficeCompanyProfileId = selected.id;
  }

  private _getProfileTypes(): number[] {
    const app = this._setting.environment.application;
    if (Application.BACK_OFFICE === app) {
      return [CompanyType.H21G, CompanyType.H21B];
    }
    return [
      CompanyType.H21G,
      CompanyType.H21B,
      CompanyType.A,
      CompanyType.AB,
      CompanyType.CORP,
    ];
  }

  private _buildUserPanel(): void {
    this._userProfileDialogRef = this._userProfileDialog.open(this.userCardData);
    this._userProfileDialogRef.afterClosed()
    .pipe(
      filter((item) => !!item),
      takeUntil(this._destroy$),
    )
    .subscribe({
      next: (action) => {
        switch (action) {
          case 'logout':
            this.onLogout();
            break;
          case 'changeCompanyProfile':
            this._openCompanySelectPanel();
            break;
          default:
            this.cardAction.emit(action);
            break;
        }
      },
    });
  }

  private _getSettings(): void {
    this._settingService.getSetting()
    .pipe(takeUntil(this._destroy$))
    .subscribe({
      next: (setting) => {
        this.userCardData.setting = setting;
        const profileId = setting.getCompanyProfileId(this._core.application);
        this._getProfile(profileId);
      },
      error: () => this.inProcess = false,
    });
  }

  private _getProfile(id: number): void {
    this._settingService.getProfile(id)
    .pipe(takeUntil(this._destroy$))
    .subscribe({
      next: (profile) => {
        this.userCardData.profile = profile;
        this._buildUserPanel();
        this.inProcess = false;
      },
      error: () => this.inProcess = false,
    });
  }

}

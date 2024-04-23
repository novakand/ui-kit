import { Inject, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSelectModule,
  MatToolbarModule
} from '@angular/material';

import {
  AUTH_CONFIG,
  AuthConfig,
  OAuthModule,
  OAuthNoopResourceServerErrorHandler,
  OAuthResourceServerErrorHandler,
  OAuthService,
} from 'angular-oauth2-oidc';

// interceptors
import { H21AuthInterceptor } from './interceptors/h21-auth-interceptor';

// components
import { H21NotificationListDialogComponent } from './h21-notification-list-dialog/h21-notification-list-dialog.component';
import { H21UserProfilePanelComponent } from '../h21-user-profile-panel/h21-user-profile-panel.component';
import { H21HeaderComponent } from './h21-header.component';

// modules
import { H21CompanySelectPanelModule } from '../h21-company-select-panel/h21-company-select-panel.module';
import { H21UserProfilePanelModule } from '../h21-user-profile-panel/h21-user-profile-panel.module';
import { H21PipesModule } from '../../pipes/h21-pipes.module';

// tokens
import { REDIRECT_URI } from './tokens/redirect-uri.token';

// services
import { H21NotificationListDialogService } from './h21-notification-list-dialog/h21-notification-list-dialog.service';
import { MockHttpClientService } from '../../services/mock-http-client.service';
import { HttpClientService } from '../../services/http-client.service';
import { ReferencesService } from '../../services/references.service';
import { SettingsService } from '../../services/settings.service';
import { AuthService } from '../../services/auth.service';

// guards
import { PermissionGuard } from '../../guards/permission.guard';
import { AdminGuard } from '../../guards/admin.guard';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatBadgeModule,
    FormsModule,
    OverlayModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatDividerModule,
    MatCardModule,
    MatListModule,
    MatSelectModule,
    MatDatepickerModule,
    BrowserModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    H21UserProfilePanelModule,
    H21PipesModule,
    H21CompanySelectPanelModule,
  ],
  declarations: [
    H21HeaderComponent,
    H21NotificationListDialogComponent,
  ],
  exports: [
    H21HeaderComponent,
  ],
  providers: [
    H21NotificationListDialogService,
  ],
  entryComponents: [
    H21NotificationListDialogComponent,
    H21UserProfilePanelComponent,
  ],
})
export class H21HeaderModule {

  public static forRoot(config: AuthConfig, useMock?: boolean): ModuleWithProviders {
    return {
      ngModule: H21HeaderModule,
      providers: [
        {
          provide: OAuthResourceServerErrorHandler,
          useClass: OAuthNoopResourceServerErrorHandler,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: H21AuthInterceptor,
          multi: true,
        },
        {
          provide: AUTH_CONFIG,
          useValue: config,
        },
        AdminGuard,
        PermissionGuard,
        SettingsService,
        ReferencesService,
        {
          provide: HttpClientService,
          useClass: useMock ? MockHttpClientService : HttpClientService,
        },
        AuthService,
      ],
    };
  }

  constructor(private oauthService: OAuthService,
              @Inject(AUTH_CONFIG) private authConfig: AuthConfig,
              @Inject(REDIRECT_URI) private redirectUri: string,
              @Optional() @SkipSelf() parentModule: H21HeaderModule,
  ) {
    if (parentModule) {
      throw new Error('H21HeaderModule is already loaded');
    }
    this._configureWithNewConfigApi();
  }

  private _configureWithNewConfigApi() {
    if (!!this.authConfig && !this.authConfig.loginUrl) {
      this.authConfig.loginUrl = `${this.authConfig.issuer}connect/authorize`;
    }
    if (!!this.authConfig && !this.authConfig.logoutUrl) {
      this.authConfig.logoutUrl = `${this.authConfig.issuer}connect/endsession`;
    }
    if (!!this.authConfig && !this.authConfig.userinfoEndpoint) {
      this.authConfig.userinfoEndpoint = `${this.authConfig.issuer}connect/userinfo`;
    }

    this.authConfig.redirectUri = this.redirectUri;
    this.authConfig.postLogoutRedirectUri = this.redirectUri;
    this.authConfig.silentRefreshRedirectUri = `${this.redirectUri}assets/silent-refresh.html`;

    this.authConfig.oidc = true;
    this.oauthService.configure(this.authConfig);
    this.oauthService.setStorage(sessionStorage);
    this.oauthService.tryLogin();
  }

}

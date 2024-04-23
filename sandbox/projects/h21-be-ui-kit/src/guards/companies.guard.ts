import { Inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { OAuthService } from 'angular-oauth2-oidc';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

// enums
import { CompanyRole } from '../lib/h21-company-profile/enums';
import { Application } from '../enums';

// interfaces
import { ICoreEnvironment } from '../interfaces/core-environment.interface';
import { IIdentityClaims } from '../interfaces';

// tokens
import { CORE_ENVIRONMENT } from '../lib/h21-company-list/core-environment.token';

// services
import { CompanySettingService } from '../lib/h21-company-profile/services/company-setting.service';

@Injectable()
export class CompaniesGuard implements CanActivate {

  constructor(private router: Router,
    private _auth: OAuthService,
    private _setting: CompanySettingService,
    @Inject(CORE_ENVIRONMENT) private _core: ICoreEnvironment,
  ) { }

  public canActivate(): Observable<boolean> {
    return this.isAdmin()
      .pipe(
        map((isAdmin) => {
          if (!isAdmin) {
            this.router.navigate(['access-denied']);
          }
          return true;
        }),
      );
  }

  public isAdmin(): Observable<boolean> {
    switch (this._core.application) {
      case Application.AGENT_OFFICE:
        return this._isAdminForAO();
      case Application.ADMIN_OFFICE:
        return of(this._isAdminForSA());
      default:
        return of(true);
    }
  }

  private _isAdminForAO(): Observable<boolean> {
    const role = this._getClaims().role;

    if (role && role.includes(CompanyRole.admin)) {
      return of(true);
    }

    return this._setting.getSetting()
      .pipe(
        map((settings) => settings.agentofficeRoles),
        map((roles) => {
          const allowed = [CompanyRole.admin, CompanyRole.sb, CompanyRole.booker];
          const found = allowed.find((item) => {
            return roles ? roles.includes(item) : false;
          });
          return !!found;
        }),
      );
  }

  private _isAdminForSA(): boolean {
    return this._isGlobalAdmin();
  }

  private _isAdminForBO(): boolean {
    const role = this._getClaims().role;
    const allowed = [CompanyRole.admin, CompanyRole.hm, CompanyRole.ho];
    const found = allowed.find((item) => {
      return role.includes(item);
    });
    return !!found;
  }

  private _getClaims(): IIdentityClaims {
    return <IIdentityClaims>this._auth.getIdentityClaims();
  }

  /**
   * Проверка на Global Admin
   */
  private _isGlobalAdmin(): boolean {
    const role = this._getClaims().role;
    return !!(role && role.includes(CompanyRole.admin));
  }

}

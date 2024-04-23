import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// external libs
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { tap } from 'rxjs/operators';

// enums
import { CompanyRole } from '../lib/h21-company-profile/enums/company-role.enum';
import { Permission } from '../enums';

// interfaces
import { IIdentityClaims, IUserPermission } from '../interfaces';

// models
import { CompanyProfileSetting } from '../lib/h21-company-profile/company-profile-setting.model';

// services
import { CompanySettingService } from '../lib/h21-company-profile/services/company-setting.service';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {

  public loaded$ = new BehaviorSubject<boolean>(false);
  public companySetting$ = new BehaviorSubject<CompanyProfileSetting>(null);
  public permissions$ = new BehaviorSubject<Map<string, IUserPermission[]>>(null);

  constructor(private _http: HttpClient,
              private _auth: OAuthService,
              private _settings: SettingsService,
              private _companySetting: CompanySettingService,
  ) { }

  public init(): void {
    forkJoin(
      this.getPermissionsList(),
      this._companySetting.getSetting(),
    )
    .subscribe({
      next: ([permissions, companySetting]) => {
        this._initPermissions(permissions);
        this._clarifyRoles(companySetting);
        this.companySetting$.next(companySetting);

        this.loaded$.next(true);
      },
    });
  }

  public getPermissionsList(): Observable<IUserPermission[]> {
    return this._http.get<IUserPermission[]>(`${this._settings.environment.apiRootUrl}Role/List`)
      .pipe(
        tap((list: IUserPermission[]) => this._initPermissions(list)),
      );
  }

  public hasPermissions(name: string): boolean {
    const permissions = this.permissions$.getValue().get(name);
    if (!permissions || !permissions.length) { return true; }

    const userRoles = this.companySetting$.getValue().agentofficeRoles;
    if (!userRoles || !userRoles.length) { return false; }

    const userPermissions = permissions.filter((permission) => userRoles.includes(permission.role));
    if (!userPermissions || !userPermissions.length) { return false; }

    const maxPermission = Math.max.apply(Math, userPermissions.map((o) => o.access)) || Permission.read;

    return Permission.read !== maxPermission;
  }

  public isAdminByClaims(): boolean {
    const role = this._getClaims().role;
    return !!(role && role.includes('admin'));
  }

  private _getClaims(): IIdentityClaims {
    return <IIdentityClaims>this._auth.getIdentityClaims();
  }

  private _clarifyRoles(companySetting: CompanyProfileSetting): void {
    if (this.isAdminByClaims()) {
      const roles = companySetting.agentofficeRoles;
      roles && roles.push(CompanyRole.globalAdmin);
    }
  }


  private _initPermissions(list: IUserPermission[]): void {
    const map = new Map<string, IUserPermission[]>();
    list.forEach((permission) => {
      const values = map.get(permission.name) || [];
      values.push(permission);
      map.set(permission.name, values);
    });
    this.permissions$.next(map);
  }

}

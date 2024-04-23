import { Injectable } from '@angular/core';

import { OAuthService } from 'angular-oauth2-oidc';

// interfaces
import { IIdentityClaims } from '../interfaces';

@Injectable()
export class AuthService {

  constructor(private _oAuth: OAuthService) { }

  public  getIdentityClaims(): IIdentityClaims {
    return <IIdentityClaims>this._oAuth.getIdentityClaims();
  }

  public  valid(): boolean {
    return this._oAuth.hasValidAccessToken();
  }

  public hasRoles(requiredRoleList: string[]): boolean {

    if (!requiredRoleList) { return false; }

    const claims = <IIdentityClaims>this._oAuth.getIdentityClaims();
    if (!claims || !claims.role) { return false; }

    return ((requiredRoleList.filter((i) => claims.role.includes(i))).length > 0);
  }

  public logOut() {
    this._oAuth.logOut();
  }

}

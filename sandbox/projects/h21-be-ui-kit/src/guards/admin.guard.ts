import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { OAuthService } from 'angular-oauth2-oidc';

import { IUser } from '../models';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private router: Router,
              private _auth: OAuthService) { }

  public canActivate(): boolean {
    const isValid = this._auth.hasValidAccessToken();
    if (isValid && this.isAdmin()) {
      return true;
    }
    this.router.navigate(['access-denied']);
  }

  public isAdmin(): boolean {
    const user: IUser = <IUser>this._auth.getIdentityClaims();
    return user && user.role && user.role.includes('admin');
  }

}

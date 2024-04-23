import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

// services
import { AuthService } from '../services/auth.service';

@Injectable()
export class PermissionGuard implements CanActivate {

  constructor(private router: Router,
              private _auth: AuthService,
  ) { }

  public canActivate(next: ActivatedRouteSnapshot): boolean {
    const requiredRoleList: string[] = next.data.roleList;

    if (this._auth.valid() && this._auth.hasRoles(requiredRoleList)) {
      return true;
    }
    this.router.navigate(['access-denied']);
  }

}

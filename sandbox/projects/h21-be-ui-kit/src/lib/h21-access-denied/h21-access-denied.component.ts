import { Component, OnInit } from '@angular/core';

import { OAuthService } from 'angular-oauth2-oidc';

import { IIdentityClaims } from '../../interfaces/identity-claims.interface';

@Component({
  selector: 'h21-access-denied',
  templateUrl: './h21-access-denied.component.html',
  styleUrls: ['./h21-access-denied.component.css'],
})
export class H21AccessDeniedComponent implements OnInit {

  public userName: string;
  public userLastName: string;

  constructor(private auth: OAuthService) { }

  public ngOnInit(): void {
    const claims = <IIdentityClaims>this.auth.getIdentityClaims();

    this.userName = claims.given_name || '';
    this.userLastName = claims.family_name || '';
  }

}

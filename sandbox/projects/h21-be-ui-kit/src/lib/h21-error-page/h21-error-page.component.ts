import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MatDialog } from '@angular/material';

import { OAuthService } from 'angular-oauth2-oidc';

import { H21ErrorPageSupportDialogComponent } from './h21-error-page-support-dialog/h21-error-page-support-dialog.component';
import { ErrorDetails } from '../../models/error-details.model';

@Component({
  selector: 'h21-error-page',
  templateUrl: './h21-error-page.component.html',
  styleUrls: ['./h21-error-page.component.css'],
})
export class H21ErrorPageComponent implements OnInit {

  @Input() public errorCode: number;
  @Input() public title: string;
  @Input() public text: string;
  @Input() public activityId: string;
  @Input() public showReLoginBtn = false;
  @Input() public disableSupportBtn = false;
  @Input() public showSupportBtn = false;

  public currentDateTime: number;

  constructor(private auth: OAuthService,
              private _route: ActivatedRoute,
              private _supportDialog: MatDialog,
  ) {
    this.currentDateTime = Date.now();
  }

  public ngOnInit(): void {
    this._route.queryParams.subscribe({
      next: (params) => this._initFromParams(params),
    });
  }

  public openSupportDialog(): void {
    const dialogConfig = {
      width: '560px',
      autoFocus: false,
      hasBackdrop: true,
      panelClass: 'h21-dialog_panel',
      backdropClass: 'h21-dialog_dark-backdrop',
    };
    this._supportDialog.open(H21ErrorPageSupportDialogComponent, dialogConfig);
  }

  public logout(): void {
    this.auth.logOut();
  }

  private _initFromParams(params: Params): void {
    const details: ErrorDetails = JSON.parse(params.errorDetails);

    if (details) {
      this.text = details.text;
      this.title = details.title;
      this.errorCode = details.errorCode;
    }
  }

}

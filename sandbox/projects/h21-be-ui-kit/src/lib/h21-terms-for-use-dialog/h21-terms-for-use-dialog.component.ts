import { Component, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { OAuthService } from 'angular-oauth2-oidc';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// services
import { UserProfileService } from '../../services/user-profile.service';

@Component({
  selector: 'h21-terms-for-use-dialog',
  templateUrl: './h21-terms-for-use-dialog.component.html',
})
export class H21TermsForUseDialogComponent implements OnDestroy {

  private _destroy$ = new Subject<boolean>();

  constructor(
    private _auth: OAuthService,
    private _userProfileService: UserProfileService,
    private _dialogRef: MatDialogRef<H21TermsForUseDialogComponent>,
  ) { }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public cancel(): void {
    this._auth.logOut();
  }

  public accept(): void {
    this._userProfileService.acceptAgreement()
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this._dialogRef.close());
  }

}

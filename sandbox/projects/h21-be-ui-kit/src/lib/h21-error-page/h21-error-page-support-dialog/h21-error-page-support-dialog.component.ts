import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Component } from '@angular/core';

@Component({
  selector: 'h21-error-page-support-dialog',
  templateUrl: './h21-error-page-support-dialog.component.html',
})
export class H21ErrorPageSupportDialogComponent {

  public messageTextCtrl: FormControl;

  constructor(private _dialogRef: MatDialogRef<H21ErrorPageSupportDialogComponent>) {
    this.messageTextCtrl = new FormControl('', [Validators.required]);
  }

  public send(): void {
    if (!this.messageTextCtrl.invalid) {
      // send mail action
    }
  }

  public close(): void {
    this._dialogRef.close();
  }

}

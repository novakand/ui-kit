import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

// enums
import { AlertType } from '../enums/alert-type';

// interfaces
import { IDialogOption } from '../models/i-dialog-option';

@Component({
  selector: 'h21-alert-dialog',
  templateUrl: './h21-alert-dialog.component.html',
})
export class H21AlertDialogComponent implements OnInit {

  @Input() public content: string;
  @Input() public closeText: string;
  @Input() public alertType: AlertType;

  public color: 'accent' | 'warn';
  public alertTypeType = AlertType;

  constructor(@Inject(MAT_DIALOG_DATA) private _options: IDialogOption,
              private _dialogRef: MatDialogRef<H21AlertDialogComponent>,
  ) {
    this.content = _options.content;
    this.closeText = _options.closeText;
    this.alertType = _options.alertType;
  }

  public ngOnInit(): void {
    switch (this.alertType) {
      case AlertType.Success:
        this.color = 'accent';
        break;
      case AlertType.Warning:
        this.color = 'warn';
        break;
    }
  }

  public close(): void {
    this._dialogRef.close();
  }

}

import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { IDialogOption } from '../models/i-dialog-option';
import { IconType } from '../enums/icon-type';

@Component({
  selector: 'h21-message-dialog',
  templateUrl: './h21-message-dialog.component.html',
})
export class H21MessageDialogComponent implements OnInit {

  @Input() public title: string;
  @Input() public content: string;
  @Input() public iconType: IconType;

  public iconName: string;
  public iconClass: string;

  constructor(@Inject(MAT_DIALOG_DATA) private _options: IDialogOption,
              private _dialogRef: MatDialogRef<H21MessageDialogComponent>,
  ) {
    this.title = _options.title;
    this.content = _options.content;
    this.iconType = _options.iconType;
  }

  public ngOnInit(): void {
    switch (this.iconType) {
      case IconType.Info:
        this.iconName = 'info';
        this.iconClass = 'h21-message-dialog_icon-info';
        break;
      case IconType.Error:
        this.iconName = 'error';
        this.iconClass = 'h21-message-dialog_icon-error';
        break;
      case IconType.Success:
        this.iconName = 'check_circle';
        this.iconClass = 'h21-message-dialog_icon-success';
        break;
      case IconType.Warning:
        this.iconName = 'warning';
        this.iconClass = 'h21-message-dialog_icon-error';
        break;
      case IconType.Stop:
        this.iconName = 'cancel';
        this.iconClass = 'h21-message-dialog_icon-error';
        break;
      case IconType.Question:
        this.iconName = 'help';
        this.iconClass = 'h21-message-dialog_icon-info';
        break;
    }
  }

  public close(): void {
    this._dialogRef.close();
  }

}

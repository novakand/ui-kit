import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject, Input } from '@angular/core';

import { IDialogOption } from '../models';

@Component({
  selector: 'h21-error-dialog',
  templateUrl: './h21-error-dialog.component.html',
})
export class H21ErrorDialogComponent {

  @Input() public title: string;
  @Input() public content: string;

  constructor(@Inject(MAT_DIALOG_DATA) public options: IDialogOption,
              private dialogRef: MatDialogRef<H21ErrorDialogComponent>,
  ) {
    this.title = options.title;
    this.content = options.content;
  }

  public close(): void {
    this.dialogRef.close();
  }

}

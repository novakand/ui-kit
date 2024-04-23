import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { IConfirmDialogOption } from '../models';

@Component({
  selector: 'h21-confirm-dialog',
  templateUrl: './h21-confirm-dialog.component.html',
})
export class H21ConfirmDialogComponent {

  @Input() public title: string;
  @Input() public content: string;
  @Input() public isCancelled = false;

  @Output() public noClick: EventEmitter<any> = new EventEmitter();
  @Output() public yesClick: EventEmitter<any> = new EventEmitter();
  @Output() public cancelClick: EventEmitter<any> = new EventEmitter();

  constructor(private dialogRef: MatDialogRef<H21ConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public options: IConfirmDialogOption,
  ) {
    this.title = options.title;
    this.content = options.content;
    this.isCancelled = options.isCancelled;
  }

  public yes(): void {
    this.yesClick.emit(null);
    this.dialogRef.close('yes');
  }

  public no(): void {
    this.noClick.emit(null);
    this.dialogRef.close('no');
  }

  public cancel(): void {
    this.cancelClick.emit(null);
    this.dialogRef.close();
  }

}

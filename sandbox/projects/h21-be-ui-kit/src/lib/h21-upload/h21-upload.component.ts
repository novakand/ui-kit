import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';

import { H21UploadDialogComponent } from './dialog/h21-upload-dialog.component';

@Component({
  selector: 'h21-upload',
  templateUrl: './h21-upload.component.html',
})
export class H21UploadComponent {

  @Input() public url: string;
  @Input() public buttonName: string;

  constructor(public dialog: MatDialog) { }

  public openUploadDialog() {
    this.dialog.open(H21UploadDialogComponent, {
      width: '50%',
      height: '50%',
      panelClass: 'c-h21-upload-dialog',
      data: { url: this.url },
    });
  }

}

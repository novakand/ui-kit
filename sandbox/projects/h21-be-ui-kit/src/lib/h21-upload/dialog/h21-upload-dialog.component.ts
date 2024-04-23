import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject, ViewChild } from '@angular/core';

import { forkJoin } from 'rxjs';

import { IFileDictionary } from '../file-dictionary';
import { H21UploadService } from '../h21-upload.service';

@Component({
  selector: 'h21-dialog',
  templateUrl: './h21-upload-dialog.component.html',
})
export class H21UploadDialogComponent {

  @ViewChild('file') public file;

  public dictionary: IFileDictionary;
  public primaryButtonText = 'Upload';

  public canBeClosed = true;
  public showCancelButton = true;

  public uploading: boolean;
  public uploadSuccessful: boolean;

  public files: Set<File> = new Set();

  constructor(public dialogRef: MatDialogRef<H21UploadDialogComponent>,
              public uploadService: H21UploadService,
              @Inject(MAT_DIALOG_DATA) public options: any,
  ) { }

  public addFiles() {
    this.file.nativeElement.click();
  }

  public onFilesAdded() {
    const files: IFileDictionary = this.file.nativeElement.files;
    Object.keys(files).forEach((key) => {
      if (!isNaN(parseInt(key, 10))) {
        this.files.add(files[key].file);
      }
    });
  }

  public trackByFn(index) {
    return index;
  }

  public closeDialog() {
    if (this.uploadSuccessful) {
      return this.dialogRef.close();
    }

    this.uploading = true;

    this.dictionary = this.uploadService.upload(this.options.url, this.files);

    const allProgressObservables = [];
    Object.keys(this.dictionary).forEach((key) => {
      allProgressObservables.push(this.dictionary[key].progress);
    });

    this.primaryButtonText = 'Finish';

    this.canBeClosed = false;
    this.showCancelButton = false;
    this.dialogRef.disableClose = true;

    forkJoin(allProgressObservables)
      .subscribe({
        next: () => {
          this.canBeClosed = true;
          this.dialogRef.disableClose = false;
          this.uploadSuccessful = true;
          this.uploading = false;
        },
      });
  }

}

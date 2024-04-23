import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatListModule,
  MatProgressBarModule
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { H21UploadDialogComponent } from './dialog/h21-upload-dialog.component';
import { H21UploadComponent } from './h21-upload.component';
import { H21UploadService } from './h21-upload.service';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    HttpClientModule,
    MatProgressBarModule,
    MatIconModule,
  ],
  declarations: [
    H21UploadComponent,
    H21UploadDialogComponent,
  ],
  exports: [
    H21UploadComponent,
  ],
  entryComponents: [
    H21UploadDialogComponent,
  ],
  providers: [
    H21UploadService,
  ],
})
export class H21UploadModule { }

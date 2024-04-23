import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
} from '@angular/material';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { H21ErrorPageSupportDialogComponent } from './h21-error-page-support-dialog/h21-error-page-support-dialog.component';
import { H21ErrorPageComponent } from './h21-error-page.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    H21ErrorPageComponent,
    H21ErrorPageSupportDialogComponent,
  ],
  exports: [
    H21ErrorPageComponent,
  ],
  entryComponents: [
    H21ErrorPageComponent,
    H21ErrorPageSupportDialogComponent,
  ],
})

export class H21ErrorPageModule { }

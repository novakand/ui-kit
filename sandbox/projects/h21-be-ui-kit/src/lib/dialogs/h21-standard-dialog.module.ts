import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { H21AlertDialogComponent } from './h21-alert-dialog/h21-alert-dialog.component';
import { H21ConfirmDialogComponent } from './h21-confirm-dialog/h21-confirm-dialog.component';
import { H21ErrorDialogComponent } from './h21-error-dialog/h21-error-dialog.component';
import { H21MessageDialogComponent } from './h21-message-dialog/h21-message-dialog.component';
import { H21DefaultDialogService } from './h21-default-dialog.service';

const items = [
  H21AlertDialogComponent,
  H21ConfirmDialogComponent,
  H21ErrorDialogComponent,
  H21MessageDialogComponent,
];

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
  ],
  declarations: items,
  exports: items,
  entryComponents: items,
  providers: [
    H21DefaultDialogService,
  ],
})
export class H21StandardDialogModule { }

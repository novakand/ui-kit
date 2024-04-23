import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule
} from '@angular/material';

import { H21TwoMonthCalendarDialogComponent } from './h21-two-month-calendar-dialog.component';
import { H21TwoMonthCalendarComponent } from './h21-two-month-calendar.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatMenuModule,
    MatDatepickerModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    H21TwoMonthCalendarComponent,
    H21TwoMonthCalendarDialogComponent,
  ],
  exports: [
    H21TwoMonthCalendarComponent,
  ],
  entryComponents: [
    H21TwoMonthCalendarDialogComponent,
  ],
})
export class H21TwoMonthCalendarModule {

  // todo: Hid the check until could resolve the conflict with importing the module in Search&Book
  //
  // constructor (
  //   @Optional() @SkipSelf() parentModule: H21TwoMonthCalendarModule,
  // ) {
  //   if (parentModule) {
  //     throw new Error('H21TwoMonthCalendarModule is already loaded');
  //   }
  // }

}

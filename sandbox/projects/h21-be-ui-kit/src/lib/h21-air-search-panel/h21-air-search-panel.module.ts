import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatOptionModule,
  MatSelectModule,
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { H21RightOverlayPanelModule } from '../h21-right-overlay-panel/h21-right-overlay-panel.module';
import { H21TwoMonthCalendarModule } from '../h21-two-month-calendar/h21-two-month-calendar.module';
import { H21FlyRouteSelectionComponent } from './h21-fly-route-selection.component';
import { H21PassengersSelectComponent } from './h21-passengers-select.component';
import { H21AirSearchPanelComponent } from './h21-air-search-panel.component';
import { H21CounterModule } from '../h21-counter/h21-counter.module';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatCheckboxModule,
    MatOptionModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatMenuModule,
    H21RightOverlayPanelModule,
    H21TwoMonthCalendarModule,
    H21CounterModule,
    MatInputModule,
  ],
  declarations: [
    H21AirSearchPanelComponent,
    H21FlyRouteSelectionComponent,
    H21PassengersSelectComponent,
  ],
  exports: [
    H21AirSearchPanelComponent,
  ],
})
export class H21AirSearchPanelModule {

  constructor (
    @Optional() @SkipSelf() parentModule: H21AirSearchPanelModule,
  ) {
    if (parentModule) {
      throw new Error('H21AirSearchPanelModule is already loaded');
    }
  }

}

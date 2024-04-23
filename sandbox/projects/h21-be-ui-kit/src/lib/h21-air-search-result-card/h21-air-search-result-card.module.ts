import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import {
  MatButtonModule,
  MatDividerModule,
  MatIconModule
} from '@angular/material';

import { H21AirSearchResultCardComponent } from './h21-air-search-result-card.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
  declarations: [
    H21AirSearchResultCardComponent,
  ],
  exports: [
    H21AirSearchResultCardComponent,
  ],
})
export class H21AirSearchResultCardModule {

  constructor (
    @Optional() @SkipSelf() parentModule: H21AirSearchResultCardModule,
  ) {
    if (parentModule) {
      throw new Error('H21AirSearchResultCardModule is already loaded');
    }
  }

}

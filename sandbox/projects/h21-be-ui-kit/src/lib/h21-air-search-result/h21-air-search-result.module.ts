import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import {
  MatButtonModule,
  MatIconModule,
  MatProgressBarModule,
  MatSelectModule,
  MatTabsModule,
} from '@angular/material';

import { H21AirSearchResultCardModule } from '../h21-air-search-result-card/h21-air-search-result-card.module';
import { H21AirSearchResultComponent } from './h21-air-search-result.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    H21AirSearchResultCardModule,
    MatSelectModule,
    MatProgressBarModule,
  ],
  declarations: [
    H21AirSearchResultComponent,
  ],
  exports: [
    H21AirSearchResultComponent,
  ],
})
export class H21AirSearchResultModule {

  constructor (
    @Optional() @SkipSelf() parentModule: H21AirSearchResultModule,
  ) {
    if (parentModule) {
      throw new Error('H21AirSearchResultModule is already loaded');
    }
  }

}

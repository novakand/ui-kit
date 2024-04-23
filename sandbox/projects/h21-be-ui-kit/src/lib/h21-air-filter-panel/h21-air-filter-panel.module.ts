import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatExpansionModule
} from '@angular/material';

import { NouisliderModule } from 'ng2-nouislider';

import { H21AirFilterPanelComponent } from './h21-air-filter-panel.component';

@NgModule({
  imports: [
    CommonModule,
    MatExpansionModule,
    MatCheckboxModule,
    NouisliderModule,
    MatButtonModule,
    MatButtonToggleModule,
  ],
  declarations: [
    H21AirFilterPanelComponent,
  ],
  exports: [
    H21AirFilterPanelComponent,
  ],
})
export class H21AirFilterPanelModule {

  constructor (
    @Optional() @SkipSelf() parentModule: H21AirFilterPanelModule,
  ) {
    if (parentModule) {
      throw new Error('H21AirFilterPanelModule is already loaded');
    }
  }

}

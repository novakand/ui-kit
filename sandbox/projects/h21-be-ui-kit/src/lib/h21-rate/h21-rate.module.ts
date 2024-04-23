import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MatIconModule } from '@angular/material';
import { CommonModule } from '@angular/common';

import { H21RateComponent } from './h21-rate.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
  ],
  declarations: [
    H21RateComponent,
  ],
  exports: [
    H21RateComponent,
  ],
})
export class H21RateModule {

  constructor (
    @Optional() @SkipSelf() parentModule: H21RateModule,
  ) {
    if (parentModule) {
      throw new Error('H21RateModule is already loaded');
    }
  }

}

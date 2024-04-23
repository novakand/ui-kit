import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatMenuModule
} from '@angular/material';

import { H21CartComboboxComponent } from './h21-cart-combobox.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
  ],
  declarations: [
    H21CartComboboxComponent,
  ],
  exports: [
    H21CartComboboxComponent,
  ],
})
export class H21CartComboboxModule {

  constructor (
    @Optional() @SkipSelf() parentModule: H21CartComboboxModule,
  ) {
    if (parentModule) {
      throw new Error('H21CartComboboxModule is already loaded');
    }
  }

}

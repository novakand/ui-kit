import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatTooltipModule,
} from '@angular/material';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { H21ComboboxComponent } from './h21-combobox.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatListModule,
    MatTooltipModule,
  ],
  declarations: [
    H21ComboboxComponent,
  ],
  exports: [
    H21ComboboxComponent,
  ],
})
export class H21ComboboxModule {

  constructor (
    @Optional() @SkipSelf() parentModule: H21ComboboxModule,
  ) {
    if (parentModule) {
      throw new Error('H21ComboboxModule is already loaded');
    }
  }

}

import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule
} from '@angular/material';

import { H21AccountSelectComponent } from './h21-account-select.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
  ],
  declarations: [
    H21AccountSelectComponent,
  ],
  exports: [
    H21AccountSelectComponent,
  ],
  entryComponents: [
    H21AccountSelectComponent,
  ],
})
export class H21AccountSelectModule {

  constructor (
    @Optional() @SkipSelf() parentModule: H21AccountSelectModule,
  ) {
    if (parentModule) {
      throw new Error('H21AccountSelectModule is already loaded');
    }
  }

}

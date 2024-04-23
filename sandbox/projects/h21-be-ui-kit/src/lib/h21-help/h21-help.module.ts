import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule
} from '@angular/material';

import { H21HelpComponent } from './h21-help.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatInputModule,
  ],
  declarations: [H21HelpComponent],
  exports: [H21HelpComponent],
})
export class H21HelpModule {

  constructor (
    @Optional() @SkipSelf() parentModule: H21HelpModule,
  ) {
    if (parentModule) {
      throw new Error('H21HelpModule is already loaded');
    }
  }

}

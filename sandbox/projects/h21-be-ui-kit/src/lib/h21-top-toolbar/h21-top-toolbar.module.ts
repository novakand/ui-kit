import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatDividerModule,
  MatIconModule, MatOptionModule, MatSelectModule, MatToolbarModule, MatTooltipModule
} from '@angular/material';

import { H21CartComboboxModule } from '../h21-cart-combobox/h21-cart-combobox.module';
import { H21BreadcrumbsModule } from '../h21-breadcrumbs/h21-breadcrumbs.module';
import { H21ComboboxModule } from '../h21-combobox/h21-combobox.module';
import { H21TopToolbarComponent } from './h21-top-toolbar.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatTooltipModule,
    FormsModule,
    H21BreadcrumbsModule,
    H21CartComboboxModule,
    H21ComboboxModule,
  ],
  declarations: [
    H21TopToolbarComponent,
  ],
  exports: [
    H21TopToolbarComponent,
  ],
})
export class H21TopToolbarModule {

  constructor (
    @Optional() @SkipSelf() parentModule: H21TopToolbarModule,
  ) {
    if (parentModule) {
      throw new Error('H21TopToolbarModule is already loaded');
    }
  }

}

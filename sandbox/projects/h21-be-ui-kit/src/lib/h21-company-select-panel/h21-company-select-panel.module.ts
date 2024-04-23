import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { A11yModule } from '@angular/cdk/a11y';
import {
  MatButtonModule,
  MatCardModule,
  MatChipsModule,
  MatIconModule,
  MatListModule,
  MatProgressBarModule,
} from '@angular/material';

import { H21CardListLoaderModule } from '../h21-card-list-loader/h21-card-list-loader.module';
import { H21ProfileImageModule } from '../h21-profile-image/h21-profile-image.module';

import { H21CompanySelectPanelComponent } from './h21-company-select-panel.component';

@NgModule({
  imports: [
    A11yModule,
    CommonModule,
    H21CardListLoaderModule,
    H21ProfileImageModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    RouterModule,
    MatChipsModule,
  ],
  declarations: [
    H21CompanySelectPanelComponent,
  ],
  exports: [
    H21CompanySelectPanelComponent,
  ],
  entryComponents: [
    H21CompanySelectPanelComponent,
  ],
})
export class H21CompanySelectPanelModule {

  constructor (
    @Optional() @SkipSelf() parentModule: H21CompanySelectPanelModule,
  ) {
    if (parentModule) {
      throw new Error('H21WhiteLabelModule is already loaded');
    }
  }

}

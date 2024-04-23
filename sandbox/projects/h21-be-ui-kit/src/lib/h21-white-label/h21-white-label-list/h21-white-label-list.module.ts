import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressBarModule,
  MatSlideToggleModule,
} from '@angular/material';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { H21ProfileImageModule } from '../../h21-profile-image/h21-profile-image.module';
import { H21WhiteLabelListComponent } from './h21-white-label-list.component';

@NgModule({
  declarations: [
    H21WhiteLabelListComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    RouterModule,
    H21ProfileImageModule,
  ],
  exports: [
    H21WhiteLabelListComponent,
  ],
  entryComponents: [
    H21WhiteLabelListComponent,
  ],
})
export class H21WhiteLabelListModule {

  constructor(
    @Optional() @SkipSelf() parentModule: H21WhiteLabelListModule,
    ) {
    if (parentModule) {
      throw new Error('H21WhiteLabelListModule is already loaded');
    }
  }

}

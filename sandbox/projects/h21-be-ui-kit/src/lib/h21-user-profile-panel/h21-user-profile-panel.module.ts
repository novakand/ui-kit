import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { A11yModule } from '@angular/cdk/a11y';
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatListModule,
  MatTooltipModule,
} from '@angular/material';

import { H21ProfileImageModule } from '../h21-profile-image/h21-profile-image.module';
import { H21UserProfilePanelComponent } from './h21-user-profile-panel.component';

@NgModule({
  imports: [
    A11yModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatTooltipModule,
    RouterModule,
    H21ProfileImageModule,
  ],
  declarations: [
    H21UserProfilePanelComponent,
  ],
  exports: [
    H21UserProfilePanelComponent,
  ],
  entryComponents: [
    H21UserProfilePanelComponent,
  ],
})

export class H21UserProfilePanelModule {

  constructor (
    @Optional() @SkipSelf() parentModule: H21UserProfilePanelModule,
  ) {
    if (parentModule) {
      throw new Error('H21UserProfilePanelModule is already loaded');
    }
  }

}

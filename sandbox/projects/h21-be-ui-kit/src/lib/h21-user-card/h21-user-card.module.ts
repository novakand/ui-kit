import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatIconModule,
  MatListModule,
} from '@angular/material';

import { H21ProfileImageModule } from '../h21-profile-image/h21-profile-image.module';
import { H21UserCardComponent } from './h21-user-card.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatDividerModule,
    RouterModule,
    H21ProfileImageModule,
  ],
  declarations: [
    H21UserCardComponent,
  ],
  exports: [
    H21UserCardComponent,
  ],
})
export class H21UserCardModule {

  constructor (
    @Optional() @SkipSelf() parentModule: H21UserCardModule,
  ) {
    if (parentModule) {
      throw new Error('H21UserCardModule is already loaded');
    }
  }

}

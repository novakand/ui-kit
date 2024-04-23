import { MatButtonModule, MatIconModule } from '@angular/material';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { H21BreadcrumbsComponent } from './h21-breadcrumbs.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  declarations: [
    H21BreadcrumbsComponent,
  ],
  exports: [
    H21BreadcrumbsComponent,
  ],
})

export class H21BreadcrumbsModule {

  constructor (
    @Optional() @SkipSelf() parentModule: H21BreadcrumbsModule,
  ) {
    if (parentModule) {
      throw new Error('H21BreadcrumbsModule is already loaded');
    }
  }

}

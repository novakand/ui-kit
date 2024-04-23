import { MatButtonModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { H21SidebarNavComponent } from './h21-sidebar-nav.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
  ],
  declarations: [
    H21SidebarNavComponent,
  ],
  exports: [
    H21SidebarNavComponent,
  ],
})
export class H21SidebarNavModule {

  constructor (
    @Optional() @SkipSelf() parentModule: H21SidebarNavModule,
  ) {
    if (parentModule) {
      throw new Error('H21SidebarNavModule is already loaded');
    }
  }

}

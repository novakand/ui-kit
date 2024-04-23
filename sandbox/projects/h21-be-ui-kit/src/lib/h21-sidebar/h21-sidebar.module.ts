import { MatButtonModule, MatIconModule, MatProgressBarModule } from '@angular/material';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { H21AirSearchResultModule } from '../h21-air-search-result/h21-air-search-result.module';
import { H21AirSearchPanelModule } from '../h21-air-search-panel/h21-air-search-panel.module';
import { H21AirFilterPanelModule } from '../h21-air-filter-panel/h21-air-filter-panel.module';
import { H21SidebarComponent } from './h21-sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    H21AirSearchPanelModule,
    H21AirSearchResultModule,
    H21AirFilterPanelModule,
  ],
  declarations: [
    H21SidebarComponent,
  ],
  exports: [
    H21SidebarComponent,
  ],
})
export class H21SidebarModule {

  constructor (
    @Optional() @SkipSelf() parentModule: H21SidebarModule,
  ) {
    if (parentModule) {
      throw new Error('H21SidebarModule is already loaded');
    }
  }

}

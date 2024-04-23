import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { H21SearchHistoryPanelComponent } from './h21-search-history-panel.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    H21SearchHistoryPanelComponent,
  ],
  exports: [
    H21SearchHistoryPanelComponent,
  ],
})
export class H21SearchHistoryPanelModule {

  constructor (
    @Optional() @SkipSelf() parentModule: H21SearchHistoryPanelModule,
  ) {
    if (parentModule) {
      throw new Error('H21SearchHistoryPanelModule is already loaded');
    }
  }

}

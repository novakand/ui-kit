import { MatButtonModule, MatIconModule } from '@angular/material';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { H21RightOverlayPanelComponent } from './h21-right-overlay-panel.component';
import { H21HelpModule } from '../h21-help/h21-help.module';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    H21HelpModule,
  ],
  declarations: [
    H21RightOverlayPanelComponent,
  ],
  exports: [
    H21RightOverlayPanelComponent,
  ],
  entryComponents: [
    H21RightOverlayPanelComponent,
  ],
})
export class H21RightOverlayPanelModule {

  constructor (
    @Optional() @SkipSelf() parentModule: H21RightOverlayPanelModule,
  ) {
    if (parentModule) {
      throw new Error('H21RightOverlayPanelModule is already loaded');
    }
  }

}

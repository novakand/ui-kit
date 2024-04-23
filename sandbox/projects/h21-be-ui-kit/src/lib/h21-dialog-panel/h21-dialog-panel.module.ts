import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';

import { H21DialogPanelComponent } from './h21-dialog-panel.component';
import { H21DialogPanelService } from './h21-dialog-panel.service';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
  ],
  providers: [
    H21DialogPanelService,
  ],
  declarations: [
    H21DialogPanelComponent,
  ],
  exports: [
    H21DialogPanelComponent,
  ],
})
export class H21DialogPanelModule {

}

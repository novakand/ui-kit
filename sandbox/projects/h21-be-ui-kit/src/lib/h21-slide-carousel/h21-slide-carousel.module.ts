import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatIconModule,
} from '@angular/material';

import { H21SlideCarouselDialogComponent } from './h21-slide-carousel-dialog.component';
import { H21SlideCarouselComponent } from './h21-slide-carousel.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  declarations: [
    H21SlideCarouselComponent,
    H21SlideCarouselDialogComponent,
  ],
  exports: [
    H21SlideCarouselComponent,
  ],
  entryComponents: [
    H21SlideCarouselDialogComponent,
  ],
})
export class H21SlideCarouselModule {

  constructor (
    @Optional() @SkipSelf() parentModule: H21SlideCarouselModule,
  ) {
    if (parentModule) {
      throw new Error('H21SlideCarouselModule is already loaded');
    }
  }

}

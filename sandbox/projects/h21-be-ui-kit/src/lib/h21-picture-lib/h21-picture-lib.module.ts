import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { H21InDevelopmentModule } from '../h21-in-development/h21-in-development.module';

// components
import { H21PictureLibComponent } from './h21-picture-lib.component';

@NgModule({
  imports: [
    CommonModule,
    H21InDevelopmentModule,
  ],
  declarations: [
    H21PictureLibComponent,
  ],
  exports: [
    H21PictureLibComponent,
  ],
  entryComponents: [
    H21PictureLibComponent,
  ],
})
export class H21PictureLibModule { }

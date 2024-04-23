import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CardLoaderComponent } from './card-loader.component';

@NgModule({
  declarations: [
    CardLoaderComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CardLoaderComponent,
  ],
  entryComponents: [
    CardLoaderComponent,
  ],
})
export class H21CardLoaderModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material';

import { TableLoaderComponent } from './table-loader.component';

@NgModule({
  declarations: [
    TableLoaderComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
  ],
  exports: [
    TableLoaderComponent,
  ],
  entryComponents: [
    TableLoaderComponent,
  ],
})
export class H21TableLoaderModule { }

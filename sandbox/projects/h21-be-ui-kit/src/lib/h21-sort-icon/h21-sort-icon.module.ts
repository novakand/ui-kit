import { MatIconModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { H21SortIconComponent } from './h21-sort-icon.component';

@NgModule({
  declarations: [
    H21SortIconComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
  ],
  exports: [
    H21SortIconComponent,
  ],
  entryComponents: [
    H21SortIconComponent,
  ],
})
export class H21SortIconModule { }

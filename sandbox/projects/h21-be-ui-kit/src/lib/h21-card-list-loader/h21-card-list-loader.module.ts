import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material';

import { H21CardListLoaderComponent } from './h21-card-list-loader.component';

@NgModule({
  declarations: [
    H21CardListLoaderComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
  ],
  exports: [
    H21CardListLoaderComponent,
  ],
  entryComponents: [
    H21CardListLoaderComponent,
  ],
})
export class H21CardListLoaderModule { }

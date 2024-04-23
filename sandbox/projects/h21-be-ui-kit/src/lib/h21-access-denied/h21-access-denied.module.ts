import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { H21ErrorPageModule } from '../h21-error-page/h21-error-page.module';
import { H21AccessDeniedComponent } from './h21-access-denied.component';

@NgModule({
  declarations: [
    H21AccessDeniedComponent,
  ],
  imports: [
    CommonModule,
    H21ErrorPageModule,
  ],
  entryComponents: [
    H21AccessDeniedComponent,
  ],
})
export class H21AccessDeniedModule { }

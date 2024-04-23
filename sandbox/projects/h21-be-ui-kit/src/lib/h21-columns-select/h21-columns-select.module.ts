import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { MatButtonModule, MatCheckboxModule, MatIconModule } from '@angular/material';
import { A11yModule } from '@angular/cdk/a11y';

// components
import { H21ColumnsSelectComponent } from './h21-columns-select.component';

// services
import { H21ColumnsSelectService } from './h21-columns-select.service';

@NgModule({
  declarations: [
    H21ColumnsSelectComponent,
  ],
  providers: [
    H21ColumnsSelectService,
  ],
  imports: [
    A11yModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  exports: [
    H21ColumnsSelectComponent,
  ],
  entryComponents: [
    H21ColumnsSelectComponent,
  ],
})
export class H21ColumnsSelectModule { }

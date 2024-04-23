import { MatButtonModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { H21CounterComponent } from './h21-counter.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    H21CounterComponent,
  ],
  exports: [
    H21CounterComponent,
  ],
})
export class H21CounterModule { }

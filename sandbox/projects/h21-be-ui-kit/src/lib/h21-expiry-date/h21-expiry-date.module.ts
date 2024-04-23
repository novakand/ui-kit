import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MatAutocompleteModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
} from '@angular/material';

import { H21ExpiryDateComponent } from './h21-expiry-date.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  declarations: [
    H21ExpiryDateComponent,
  ],
  exports: [
    H21ExpiryDateComponent,
  ],
})

export class H21ExpiryDateModule {
}

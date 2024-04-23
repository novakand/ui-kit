import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
} from '@angular/material';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// components
import { H21FilterComponent } from './components/h21-filter/h21-filter.component';
import { H21FilterDatePickerComponent } from './components/h21-filter-date-picker/h21-filter-date-picker.component';

@NgModule({
  declarations: [H21FilterComponent, H21FilterDatePickerComponent],
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatAutocompleteModule,
  ],
  exports: [H21FilterComponent],
})
export class H21FilterModule { }

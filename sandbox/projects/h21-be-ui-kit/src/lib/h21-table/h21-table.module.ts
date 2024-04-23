import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// material
import { MatButtonModule, MatIconModule, MatPaginatorModule, MatTableModule } from '@angular/material';

// modules
import { H21TableLoaderModule } from '../h21-table-loader/h21-table-loader.module';

// components
import { H21TableComponent } from './components/table/h21-table.component';
import { H21SortTableComponent } from './components/sort-table/h21-sort-table.component';

@NgModule({
  declarations: [
    H21TableComponent,
    H21SortTableComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    H21TableLoaderModule,
  ],
  exports: [
    H21TableComponent,
    H21SortTableComponent,
  ],
})
export class H21TableModule { }

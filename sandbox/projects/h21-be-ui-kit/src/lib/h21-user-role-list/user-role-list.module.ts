import {
  MatButtonModule,
  MatIconModule,
  MatTableModule,
} from '@angular/material';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// modules
import { H21TableLoaderModule } from '../h21-table-loader/h21-table-loader.module';

// components
import { UserRoleListComponent } from './user-role-list.component';

@NgModule({
  declarations: [
    UserRoleListComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    H21TableLoaderModule,
  ],
  exports: [
    UserRoleListComponent,
  ],
  entryComponents: [
    UserRoleListComponent,
  ],
})
export class UserRoleListModule { }

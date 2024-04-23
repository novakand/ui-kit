import {
  MatButtonModule,
  MatIconModule,
  MatTableModule,
  MatTooltipModule,
} from '@angular/material';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// modules
import { H21TableLoaderModule } from '../h21-table-loader/h21-table-loader.module';
import { H21PictureLibModule } from '../h21-picture-lib/h21-picture-lib.module';
import { H21PipesModule } from '../../pipes/h21-pipes.module';

// routing
import { UsersImportRoutingModule } from './users-import-routing.module';

// components
import { ImportInfoComponent } from './import-info/import-info.component';
import { UsersImportComponent } from './users-import.component';

@NgModule({
  declarations: [
    UsersImportComponent,
    ImportInfoComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatTooltipModule,
    H21TableLoaderModule,
    UsersImportRoutingModule,
    H21PictureLibModule,
    H21PipesModule,
  ],
  entryComponents: [
    UsersImportComponent,
    ImportInfoComponent,
  ],
})
export class UsersImportModule { }

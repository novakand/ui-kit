import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DxContextMenuModule } from 'devextreme-angular/ui/context-menu';
import { DxValidatorModule } from 'devextreme-angular/ui/validator';
import { DxDateBoxModule } from 'devextreme-angular/ui/date-box';
import { DxButtonModule } from 'devextreme-angular/ui/button';

import { H21DateTimeEditComponent } from './h21-date-time-edit.component';
import { H21PipesModule } from '../../pipes/h21-pipes.module';

@NgModule({
  imports: [
    CommonModule,
    DxButtonModule,
    DxDateBoxModule,
    DxContextMenuModule,
    DxValidatorModule,
    H21PipesModule,
  ],
  exports: [ H21DateTimeEditComponent ],
  declarations: [ H21DateTimeEditComponent ],
})
export class H21DateTimeEditModule { }

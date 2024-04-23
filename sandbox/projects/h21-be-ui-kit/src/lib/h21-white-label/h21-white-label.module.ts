import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatProgressBarModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatTabsModule,
} from '@angular/material';

import { DxColorBoxModule } from 'devextreme-angular/ui/color-box';

import { H21WhiteLabelListModule } from './h21-white-label-list/h21-white-label-list.module';
import { FileUploaderService } from '../../services/file-uploader.service';
import { H21WhiteLabelComponent } from './h21-white-label.component';
import { H21PipesModule } from '../../pipes/h21-pipes.module';
import { H21StandardDialogModule } from '../dialogs/h21-standard-dialog.module';

@NgModule({
  imports: [
    A11yModule,
    CommonModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatSliderModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    DxColorBoxModule,
    H21PipesModule,
    H21WhiteLabelListModule,
    H21StandardDialogModule,
  ],
  providers: [
    FileUploaderService,
  ],
  declarations: [
    H21WhiteLabelComponent,
  ],
  exports: [
    H21WhiteLabelComponent,
  ],
  entryComponents: [
    H21WhiteLabelComponent,
  ],
})
export class H21WhiteLabelModule {

  constructor (
    @Optional() @SkipSelf() parentModule: H21WhiteLabelModule,
  ) {
    if (parentModule) {
      throw new Error('H21WhiteLabelModule is already loaded');
    }
  }

}

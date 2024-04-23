import {
  MatButtonModule,
  MatCardModule, MatChipsModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatOptionModule,
  MatProgressBarModule,
  MatSelectModule,
  MatStepperModule,
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// modules
import { H21CardListLoaderModule } from '../h21-card-list-loader/h21-card-list-loader.module';
import { H21ProfileImageModule } from '../h21-profile-image/h21-profile-image.module';

// services
import { LinkDialogService } from './link-dialog.service';

// components
import { LinksDialogComponent } from './links-dialog.component';

// modules
import { H21DirectivesModule } from '../../directives/h21-directives.module';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MatListModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatChipsModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    H21DirectivesModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    H21ProfileImageModule,
    H21CardListLoaderModule,
  ],
  declarations: [
    LinksDialogComponent,
  ],
  exports: [
    LinksDialogComponent,
  ],
  entryComponents: [
    LinksDialogComponent,
  ],
  providers: [
    LinkDialogService,
  ],
})
export class H21LinksDialogModule { }

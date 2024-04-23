import {
  MatButtonModule,
  MatCardModule,
  MatChipsModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// modules
import { BaseCompanyProfileModule } from '../h21-company-profile/base-company-profile.module';
import { H21ProfileImageModule } from '../h21-profile-image/h21-profile-image.module';
import { H21CardLoaderModule } from '../h21-card-loader/h21-card-loader.module';
import { H21HistoryModule } from '../h21-history/h21-history.module';
import { H21TableModule } from '../h21-table/h21-table.module';

// routing
import { routing } from './subsidiary-routing.module';

// components
import { DetailsComponent } from './components/details/details.component';

@NgModule({
  declarations: [
    DetailsComponent,
  ],
  imports: [
    routing,
    FormsModule,
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatInputModule,
    H21TableModule,
    MatChipsModule,
    MatButtonModule,
    MatSelectModule,
    MatTooltipModule,
    H21HistoryModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    H21CardLoaderModule,
    H21ProfileImageModule,
    BaseCompanyProfileModule,
  ],
})
export class SubsidiaryModule { }

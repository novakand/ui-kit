import {
  MatButtonModule,
  MatIconModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatTableModule,
  MatTooltipModule,
} from '@angular/material';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { SettingsService } from '../../services/settings.service';

import { H21TableLoaderModule } from '../h21-table-loader/h21-table-loader.module';

import { H21HistoryComponent } from './h21-history.component';

import { BASE_URL } from './base-url.token';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    H21TableLoaderModule,
  ],
  declarations: [
    H21HistoryComponent,
  ],
  exports: [
    H21HistoryComponent,
  ],
  entryComponents: [
    H21HistoryComponent,
  ],
  providers: [
    SettingsService,
  ],
})
export class H21HistoryModule {

  public static forRoot(baseUrl: string): ModuleWithProviders {
    return {
      ngModule: H21HistoryModule,
      providers: [
        {
          provide: BASE_URL,
          useValue: baseUrl,
        },
      ],
    };
  }

}

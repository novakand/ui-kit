import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { H21ProfileImageComponent } from './h21-profile-image.component';
import { SettingsService } from '../../services/settings.service';
import { H21PipesModule } from '../../pipes/h21-pipes.module';


@NgModule({
  imports: [
    CommonModule,
    H21PipesModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
  ],
  declarations: [
    H21ProfileImageComponent,
  ],
  exports: [
    H21ProfileImageComponent,
  ],
  entryComponents: [
    H21ProfileImageComponent,
  ],
  providers: [
    SettingsService,
  ],
})
export class H21ProfileImageModule { }

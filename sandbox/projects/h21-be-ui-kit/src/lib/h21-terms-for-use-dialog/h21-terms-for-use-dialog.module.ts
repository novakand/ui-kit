import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatButtonModule, MatDialogModule } from '@angular/material';

// components
import { H21TermsForUseDialogComponent } from './h21-terms-for-use-dialog.component';

// services
import { H21TermsForUseService } from './h21-terms-for-use.service';

@NgModule({
  declarations: [
    H21TermsForUseDialogComponent,
  ],
  providers: [
    H21TermsForUseService,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
  ],
  exports: [
    H21TermsForUseDialogComponent,
  ],
  entryComponents: [
    H21TermsForUseDialogComponent,
  ],
})
export class H21TermsForUseDialogModule { }

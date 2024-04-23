import { MatFormFieldModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// directives
import { MatFormFieldRequiredDirective } from './mat-form-field-required/mat-form-field-required.directive';
import { HasPermissionDirective } from './has-permission.directive';
import { H21EnterPressedDirective } from './h21-enter-pressed.directive';

@NgModule({
  declarations: [
    HasPermissionDirective,
    MatFormFieldRequiredDirective,
    H21EnterPressedDirective,
  ],
  imports: [
    FormsModule,
    MatFormFieldModule,
  ],
  exports: [
    H21EnterPressedDirective,
    HasPermissionDirective,
    MatFormFieldRequiredDirective,
  ],
})
export class H21DirectivesModule { }

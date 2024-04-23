import { NgModule } from '@angular/core';

import { SafeResourceUrlPipe } from './safe-rescource-url.pipe';
import { H21CapitalizePipe } from './h21-capitalize.pipe';
import { EnumToArrayPipe } from './enum-to-array.pipe';
import { H21DateTimePipe } from './h21-date-time.pipe';
import { TruncatePipe } from './truncate.pipe';
import { H21ConcatFieldsPipe } from './h21-concat-fields.pipe';
import { H21HideCardNumberPipe } from './h21-hide-card-number.pipe';

const pipes = [
  EnumToArrayPipe,
  SafeResourceUrlPipe,
  H21DateTimePipe,
  H21CapitalizePipe,
  TruncatePipe,
  H21ConcatFieldsPipe,
  H21HideCardNumberPipe,
];

@NgModule({
  declarations: pipes,
  exports: pipes,
})
export class H21PipesModule {}

import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStateDirective } from './directives/order-state.directive';

@NgModule({
  declarations: [
    OrderStateDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    OrderStateDirective,
  ],
})
export class H21BookingSharedModule {

  constructor (
    @Optional() @SkipSelf() parentModule: H21BookingSharedModule,
  ) {
    if (parentModule) {
      throw new Error('H21BookingSharedModule is already loaded');
    }
  }

}

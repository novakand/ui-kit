import { Component, Input } from '@angular/core';

import { ICartComboboxRow } from '../../interfaces/cart-combobox-row.interface';

const CART_DATA: ICartComboboxRow[] = [
  { id: 1, name: 'Standart Double room', description: 'Non-refundable', provider: 'EX', price: 10000.00 },
  { id: 2, name: 'Standart Double room', description: 'Non-refundable', provider: 'EX', price: 8000.00 },
  { id: 3, name: 'Standart Double room', description: 'Non-refundable', provider: 'EX', price: 9000.00 },
];

@Component({
  selector: 'h21-cart-combobox',
  templateUrl: './h21-cart-combobox.component.html',
})
export class H21CartComboboxComponent {

  @Input() public data: ICartComboboxRow[];

  public currencyCode = 'EUR';
  public dropBoxVisibility = false;

  constructor() {
    this.data = CART_DATA;
  }

  public trackByFn(index) {
    return index;
  }

  public toggle() {
    this.dropBoxVisibility = !this.dropBoxVisibility;
  }

}

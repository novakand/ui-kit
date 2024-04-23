import { Component } from '@angular/core';

@Component({
  selector: 'h21-counter-input',
  templateUrl: './counter-input.component.html',
})
export class CounterInputComponent {

  public display = 0;
  public title = 'Counter input';

  public count(operation, step) {
    if (!step) {
      step = 1;
    }

    if (operation === 'plus') {
      this.display = this.display += step;
    } else if (operation === 'minus') {
      this.display = this.display -= step;
    }
  }

}

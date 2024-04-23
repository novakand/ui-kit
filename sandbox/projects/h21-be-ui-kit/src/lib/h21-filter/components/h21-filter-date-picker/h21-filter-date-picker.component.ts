import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

// models
import { BaseControl } from '../../models';

@Component({
  selector: 'h21-filter-date-picker',
  templateUrl: './h21-filter-date-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class H21FilterDatePickerComponent {

  @Input() public control: BaseControl;
  @Output() public emitPicker = new EventEmitter();

  public change(value: string): void {
    this.emitPicker.emit(value);
  }

}

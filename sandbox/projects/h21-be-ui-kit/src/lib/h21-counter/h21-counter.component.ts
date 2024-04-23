import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// models
import { ActionInfo } from './action-info.model';

// enums
import { ActionType } from './action-type.enum';

@Component({
  selector: 'h21-counter',
  templateUrl: './h21-counter.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => H21CounterComponent),
      multi: true,
    },
  ],
})
export class H21CounterComponent implements ControlValueAccessor {

  @Input() public value = 0;
  @Input() public max = 99;
  @Input() public min = -99;
  @Input() public reduceOnlyProgrammatically: boolean;
  @Input() public increaseOnlyProgrammatically: boolean;
  @Input() public disabled: boolean;

  @Output() public changed = new EventEmitter<number>();
  @Output() public reduced = new EventEmitter<void>();
  @Output() public increased = new EventEmitter<void>();
  @Output() public changedInfo = new EventEmitter<ActionInfo>();

  constructor() { }

  public reduce() {
    if (this.reduceOnlyProgrammatically) {
      this.reduced.emit();
    } else {
      if (this.value >= this.min) {
        this.value--;
        this.changed.emit(this.value);
        this.changedInfo.emit(new ActionInfo({
          value: this.value,
          type: ActionType.reduce,
        }));
      }
    }
    this.onChange(this.value);
  }

  public increase() {
    if (this.increaseOnlyProgrammatically) {
      this.increased.emit();
    } else {
      if (this.value <= this.max) {
        this.value++;
        this.changed.emit(this.value);
        this.changedInfo.emit(new ActionInfo({
          value: this.value,
          type: ActionType.increase,
        }));
      }
    }
    this.onChange(this.value);
  }

  public onTouched = () => {};
  public onChange = (value: any) => {};

  public setDisabledState(isDisabled: boolean): void { }
  public writeValue(val: number): void { this.value = val; }
  public registerOnChange(fn: any): void { this.onChange = fn; }
  public registerOnTouched(fn: any): void { this.onTouched = fn; }

}

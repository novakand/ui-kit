import { Component, forwardRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';

@Component({
  selector: 'h21-expiry-date',
  templateUrl: './h21-expiry-date.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => H21ExpiryDateComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => H21ExpiryDateComponent),
      multi: true,
    },
  ],
})
export class H21ExpiryDateComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor, Validator {

  @Input() public expireYear = 30;
  @Input() public valRequired: string;

  public ngOnChanges(changes: SimpleChanges): void {
  }

  public ngOnDestroy(): void {
  }

  public ngOnInit(): void {
  }

  public registerOnChange(fn: any): void {
  }

  public registerOnTouched(fn: any): void {
  }

  public registerOnValidatorChange(fn: () => void): void {
  }

  public setDisabledState(isDisabled: boolean): void {
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    return undefined;
  }

  public writeValue(obj: any): void {
  }

}

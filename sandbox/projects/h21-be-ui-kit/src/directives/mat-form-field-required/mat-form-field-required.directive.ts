import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  ContentChild,
  Directive,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { MatFormFieldControl } from '@angular/material';
import { FormControl } from '@angular/forms';

import { CustomMatFormFieldControl } from './custom-mat-form-field-control';

// tslint:disable
@Directive({
  selector: 'mat-form-field',
})
// tslint:enable
export class MatFormFieldRequiredDirective implements AfterViewInit, AfterViewChecked {

  @ContentChild(MatFormFieldControl) private _control: CustomMatFormFieldControl<any>;

  constructor(
    private hostElementRef: ElementRef,
    private _cdRef: ChangeDetectorRef,
    private _renderer: Renderer2,
  ) { }

  public ngAfterViewInit(): void {
    if (this._control && this._control.ngControl) {
      const { ngControl } = this._control;
      const validator = ngControl.form
        ? ngControl.form.validator
        : ngControl.control ? ngControl.control.validator : null;

      if (validator) {
        Promise.resolve().then(() => {
          this._control.required = !!(validator(new FormControl()) || {}).required;
          this._cdRef.markForCheck();
        });
      }
    }
  }

  public  ngAfterViewChecked(): void {
    if (this._control.required) {
      if (this._control.disabled) {
        this._renderer.addClass(this.hostElementRef.nativeElement, 'h21-mat-form-field-required');
      } else {
        this._renderer.removeClass(this.hostElementRef.nativeElement, 'h21-mat-form-field-required');
      }
      this._cdRef.detectChanges();
    }
  }

}

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';

// models
import { BaseControl } from '../models/base-control';
import { PickerControl } from '../models/picker-control';

@Injectable({
  providedIn: 'root',
})
export class H21FilterService {

  public buildFormGroup<T>(controls: BaseControl[]): FormGroup {
    const group = {};

    controls.forEach((control) => {
      if (control.controlType === 'datepicker') {
        control.range.pickers.forEach((picker) => group[picker.key] = this._buildControl(picker));
      } else if (control.controlType === 'countries-autocomplete') {
        group[control.key] = new FormControl();
      } else {
        group[control.key] = this._buildControl(control);
      }
    });
    return new FormGroup(group);
  }

  private _buildControl(control: PickerControl | BaseControl): FormControl {
    return control.required ? new FormControl(control.value, Validators.required) : new FormControl(control.value);
  }

}

import { MatFormFieldControl } from '@angular/material';

import { CustomMatFormFieldNgControl } from './custom-mat-form-field-ng-control';

export abstract class CustomMatFormFieldControl<T> extends MatFormFieldControl<T> {

  public required: boolean;
  public ngControl: CustomMatFormFieldNgControl;

}

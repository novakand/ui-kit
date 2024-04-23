import { AbstractControl, ValidatorFn } from '@angular/forms';

// @dynamic
export class FormCustomValidators {

  public static valueSelected(list: any[], key: string): ValidatorFn {

    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value) {
        const result = list.find((item) => item[key] === control.value);
        return result ? null : { match: true };
      } else {
        return null;
      }
    };
  }

}

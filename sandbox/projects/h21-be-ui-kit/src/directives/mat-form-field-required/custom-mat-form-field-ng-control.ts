import { AbstractControl, NgControl } from '@angular/forms';

export abstract class CustomMatFormFieldNgControl extends NgControl {

  public form?: AbstractControl;

}

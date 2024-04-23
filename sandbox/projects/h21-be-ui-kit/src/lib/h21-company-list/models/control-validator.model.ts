import { AbstractControl } from '@angular/forms';

export class ControlValidator {

  constructor(public control: AbstractControl,
              public pattern: RegExp,
              public setValidator: boolean,
              public clearIfChanged: boolean,
            ) { }

}

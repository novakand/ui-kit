import { Pipe, PipeTransform } from '@angular/core';

import { H21StringUtils } from '../services/h21-string.utils';

@Pipe({
  name: 'h21Capitalize',
})
export class H21CapitalizePipe implements PipeTransform {

  constructor() { }

  public transform(value: string, args?: any): any {
    return H21StringUtils.capitalize(value);
  }

}

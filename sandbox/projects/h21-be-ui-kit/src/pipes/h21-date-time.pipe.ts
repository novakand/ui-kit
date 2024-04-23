import { Pipe, PipeTransform } from '@angular/core';

import { IH21DateTime } from '../interfaces/h21-date-time.interface';

@Pipe({
  name: 'h21DateTime',
})
export class H21DateTimePipe implements PipeTransform {

  public transform(value: IH21DateTime, args?: any): any {
    if (!value) {
      return null;
    }
    return `${value.date} ${value.time}`;
  }

}

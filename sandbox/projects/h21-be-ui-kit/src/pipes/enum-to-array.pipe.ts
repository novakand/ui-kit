import { Pipe, PipeTransform } from '@angular/core';

import { KeyValue } from '../models';

@Pipe({
  name: 'h21EnumToArray',
})
export class EnumToArrayPipe implements PipeTransform {

  public transform(value: any, args?: string[]): KeyValue[] {
    return Object.keys(value)
      .filter((x) => parseInt(x, 10) >= 0)
      .map((key) => {
        return {
          id: 0,
          key,
          value: value[key],
        };
      });
  }

}

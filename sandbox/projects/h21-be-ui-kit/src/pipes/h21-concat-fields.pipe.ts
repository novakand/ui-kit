import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'h21ConcatFields',
})
export class H21ConcatFieldsPipe implements PipeTransform {

  public transform<T>(value: T, fields: string[], separator: string = ' '): string {
    const result = [];
    fields.forEach((name) => value[name] && result.push(value[name]));

    return result.join(separator);
  }

}

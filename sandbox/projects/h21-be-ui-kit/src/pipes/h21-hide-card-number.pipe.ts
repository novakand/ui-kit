import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'h21HideCardNumber',
})
export class H21HideCardNumberPipe implements PipeTransform {

  public transform(number: string, isReplace?: boolean): string {
    if (!number || !isReplace) { return number; }
    const length = number.length;
    if (isReplace) {
      return  (length >= 4)  ? `${number.substring(0, 2)}${'**********'}${number.substring(length - 4, length)}` : '**********';
    }
    return number;
  }

}

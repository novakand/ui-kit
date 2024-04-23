import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  pure: true,
})
export class TruncatePipe implements PipeTransform {

  public transform(value: string, count?: number): string {
    if (value) {
      const size = count ? count : 500;
      return value.length > size ? `${value.substring(0, size)}...` : value;
    }
  }

}

import { NativeDateAdapter } from '@angular/material';

export class H21DateAdapter extends NativeDateAdapter {

  public format(date: Date, displayFormat: string): string {

    if (displayFormat === 'input') {
      const day = this._to2digit(date.getDate());
      const month = this._to2digit(date.getMonth() + 1);
      const year = date.getFullYear();
      return `${month}.${day}.${year}`;
    }

    return date.toDateString();
  }

  private _to2digit(value: number) {
    return `00${value}`.slice(-2);
  }

}

import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {

  constructor(@Inject(LOCALE_ID) private locale: string) { }

  public getFormattedDate(date: any, withTime: boolean = false): string {
    if (!date) {
      return '';
    }

    try {
      return (typeof date.getMonth === 'function')
        ? this._dateToFormattedString(date, withTime)
        : (typeof date === 'string')
          ? this._dateToFormattedString(new Date(date), withTime)
          : this._dateToFormattedString(Date.UTC(date.year, date.month, date.day, date.hour, date.minute, date.second), withTime);
    } catch (err) { }
    return '';

  }

  public newGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = this._getSecureRandomValue() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private _dateToFormattedString(date: Date | number, withTime: boolean = false): string {
    const format = withTime ? 'MM.dd.yyyy HH:mm' : 'MM.dd.yyyy';
    return formatDate(date, format, this.locale);
  }

  private _getSecureRandomValue(): number {
    const buf = new Uint8Array(1);
    crypto.getRandomValues(buf);
    return buf[0];
  }

}

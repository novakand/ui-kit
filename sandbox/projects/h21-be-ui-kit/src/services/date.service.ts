import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material';
import { Inject, Injectable } from '@angular/core';

import { H21DateTime } from '../models/h21-date-time.model';
import { H21DateTimePatternTypes } from '../models';

@Injectable()
export class DateService {

  constructor(private dateAdapter: DateAdapter<Date>,
              @Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats,
  ) { }

  public getH21DateTimeToday(): H21DateTime {
    const today = this.dateAdapter.today();
    return this.dateToH21DateTime(today);
  }

  public toDate(dateTime: H21DateTime): Date {
    return dateTime && new Date(
      dateTime.year,
      dateTime.month - 1,
      dateTime.day,
      dateTime.hour,
      dateTime.minute,
      dateTime.second,
    );
  }

  public dateToH21DateTime(date: Date): H21DateTime {
    return this.getDateByPattern(date, H21DateTimePatternTypes.H21);
  }

  /**
   * Return the H21DateTime with date and time format output pattern
   * @param date - input date of the {@link Date}
   * @param pattern - pattern for formatting {@link H21DateTimePatternTypes}
   * @returns The date of {@link H21DateTime}
   */
  public getDateByPattern(date: Date, pattern: H21DateTimePatternTypes): H21DateTime {

    if (!date) {
      return null;
    }

    const result = this._getDateData(date);

    switch (pattern) {
      case H21DateTimePatternTypes.Base:
        result.date =
          `${ this._getZeroFilled(result.year, 4) }-${ this._getZeroFilled(result.month) }-${ this._getZeroFilled(result.day) }`;
        result.time =
          `${ this._getZeroFilled(result.hour) }:${ this._getZeroFilled(result.minute) }:${ this._getZeroFilled(result.second) }`;
        break;
      case H21DateTimePatternTypes.H21_SHORT_MONTH:
        result.date =
          `${ this._getZeroFilled(result.day) } ${ this._getMonthName(date) } ${ this._getZeroFilled(result.year, 4) }`;
        result.time =
          `${ this._getZeroFilled(result.hour) }:${ this._getZeroFilled(result.minute) }:${ this._getZeroFilled(result.second) }`;
        break;
      case H21DateTimePatternTypes.H21:
      default:
        result.date = `${ result.year }-${ result.month }-${ result.day }`;
        result.time = `${ result.hour }:${ result.minute }:${ result.second }`;
        break;
    }

    return result;
  }

  private _getMonthName(date: Date): string {
    return date.toLocaleString('en', { month: 'short' });
  }

  private _getZeroFilled(num: number, zeroCount: number = 2): string {
    let zeros = '';

    for (let i = 0; i < zeroCount; i++) {
      zeros += '0';
    }
    return (`${ zeros }${ num }`).slice(-zeroCount);
  }

  private _getDateData(date: Date) {
    const result = new H21DateTime();
    result.year = date.getFullYear();
    result.month = date.getMonth() + 1;
    result.day = date.getDate();
    result.hour = date.getHours();
    result.minute = date.getMinutes();
    result.second = date.getSeconds();
    return result;
  }

}

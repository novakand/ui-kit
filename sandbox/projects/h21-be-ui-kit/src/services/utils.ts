import { AbstractControl } from '@angular/forms';
import { IOrder } from '../interfaces/order.interface';

// @dynamic
export class Utils {

  public static phoneRegexp = new RegExp('^\\+?(\\d{1,5}[- ]*)(\\d{1,5}[- ]*)\\d{1,8}$');
  // tslint:disable
  public static emailRegexp = new RegExp('(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))');
  // tslint:enable

  public static times = (n, f) => { while (n-- > 0) { f(); } };

  /**
   * Валидация Datepicker, проверяем на содержание ошибки
   * @param control контролл Datepicker
   */
  public static matDatepickerHasError(control: AbstractControl): boolean {
    return control.hasError('matDatepickerMax')
      || control.hasError('matDatepickerMin')
      || control.hasError('matDatepickerParse');
  }

  /*
   * Function to get Current Domain Url
   * Samples:
   *      "https://domain.sharepoint.com"
   */
  public static getAbsoluteDomainUrl(): string {
    if (window
      && 'location' in window
      && 'protocol' in window.location
      && 'host' in window.location) {
      return window.location.host;
    }
    return null;
  }

  public static deepCopy<T>(item: T): T {
    return JSON.parse(JSON.stringify(item));
  }

  public static getDateWithOffset(date: Date): Date {
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
  }

  public static getUTCDate(date: Date): Date {
    return new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
  }

  public static parseDate(value: string): Date {
    const date = new Date(value);
    if (date.toString() === 'Invalid Date') {
      return null;
    }
    return this.getDateWithOffset(new Date(value));
  }

  public static getUrlFromBlob(file: string, data: Blob): string {
    if (file) {
      const isSvg = file.includes('.svg');
      isSvg && (data = new Blob([data], { type: 'image/svg+xml' }));
    }
    return window.URL.createObjectURL(data);
  }

  public static sort(order: IOrder, field: string): IOrder {
    if (!order || order.field !== field) {
      order = {
        field: field,
        desc: false,
      };
    } else {
      order.desc = !order.desc;
    }
    return order;
  }

  /**
   * Формируем support url email строку
   * @param email эмаил
   */
  public static getSupportEmailLink(email: string): string {
    return `mailto:${email}?subject=Support request`;
  }

}

import { IH21DateTime } from '../interfaces/h21-date-time.interface';

export class H21DateTime implements IH21DateTime {

  public year: number;
  public month: number;
  public day: number;
  public hour: number;
  public minute: number;
  public second: number;
  public time: string;
  public date: string;

  constructor(obj?: Partial<H21DateTime>) {
    (<any>Object).assign(this, obj);
  }

}

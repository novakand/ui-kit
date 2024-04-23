export class DateTime {

  public year: number;
  public month: number;
  public day: number;
  public hour: number;
  public minute: number;
  public second: number;
  public time: string;
  public date: string;

  constructor(obj?: Partial<DateTime>) {
    (<any>Object).assign(this, obj);
  }

}

import { DateTime } from './date-time.model';

export class Menu {

  public date: DateTime;
  public icon: string;
  public action: any;

  constructor(obj?: Partial<Menu>) {
    (<any>Object).assign(this, obj);
  }

}

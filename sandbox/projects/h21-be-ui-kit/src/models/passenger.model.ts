export class Passenger {

  public id: string;
  public age: number;
  public firstName: string;
  public surname: string;
  public email: string;
  public company: string;
  public position: string;
  public listState: string;
  public type: 'adult' | 'children' | 'infant';

  constructor(data?: Partial<Passenger>) {
    (<any>Object).assign(this, data);
  }

}

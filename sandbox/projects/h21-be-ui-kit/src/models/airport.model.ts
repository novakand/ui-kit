export class Airport {

  public code: string;
  public name: string;

  constructor(data?: Partial<Airport>) {
    (<any>Object).assign(this, data);
  }

}

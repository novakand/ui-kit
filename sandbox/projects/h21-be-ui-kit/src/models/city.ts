import { Airport } from './airport.model';

export class City {

  public id: number;
  public code: string;
  public countryCode: string;
  public name: string;
  public isTransient: boolean;
  public airports: Airport[];

  constructor(data?: Partial<City>) {
    (<any>Object).assign(this, data);
  }

}

import { City } from './city';

export class FlyRoute {

  public cityFrom: City;
  public cityTo: City;
  public departureDate: Date;
  public returnDate: Date;
  public minDate: Date;
  public rangeDateMode: boolean;

  constructor(data?: Partial<FlyRoute>) {
    (<any>Object).assign(this, data);
  }

}

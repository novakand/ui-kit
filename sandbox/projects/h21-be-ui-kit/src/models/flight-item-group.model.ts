import { FlightItem } from './flight-item.model';

export class FlightItemGroup {

  public price: number;
  public totalElapsedTime: number;
  public items: FlightItem[];

  constructor(data?: Partial<FlightItemGroup>) {
    (<any>Object).assign(this, data);
  }

}

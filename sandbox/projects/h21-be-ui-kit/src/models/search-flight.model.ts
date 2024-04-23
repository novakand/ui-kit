import { FlyRoute } from './fly-route.model';

export class SearchFlight {

  public searchMode: string;
  public flyRoutes: FlyRoute[];
  public preferredClass: string;
  public directFlight: boolean;
  public refundableFlights: boolean;
  public showTransfers: boolean;
  public showHotels: boolean;
  // stops
  public anyNumberOfStops: boolean;
  public nonstopOnly: boolean;
  public oneStopOfFewer: boolean;
  public twoStopOfFewer: boolean;
  // price
  public priceFrom: number;
  public priceTo: number;

  constructor(data: Partial<SearchFlight>) {
    (<any>Object).assign(this, data);
  }

}

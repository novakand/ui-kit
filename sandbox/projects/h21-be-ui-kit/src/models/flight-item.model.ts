import { FlightItemTransfer } from './flight-item-transfer.model';

export class FlightItem {

  public departureDateTime: Date;
  public arrivalDateTime: Date;
  public flightNumber: string;
  public resBookDesigCode: string;
  public elapsedTime: number;
  public departureAirportCode: string;
  public departureAirportTerminal: string;
  public arrivalAirportCode: string;
  public arrivalAirportTerminal: string;
  public arrivalLogo: string;
  public departureLogo: string;
  public transfers: FlightItemTransfer[];

  constructor(data?: Partial<FlightItem>) {
    (<any>Object).assign(this, data);
  }

}

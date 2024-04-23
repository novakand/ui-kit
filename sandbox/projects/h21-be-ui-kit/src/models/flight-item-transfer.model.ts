export class FlightItemTransfer {

  public time: Date;
  public airportCode: string;

  constructor(data?: Partial<FlightItemTransfer>) {
    (<any>Object).assign(this, data);
  }

}

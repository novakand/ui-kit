import { Injectable } from '@angular/core';

import { OrderData, Passenger } from '../models';

@Injectable()
export class OrderService {

  private _orderData: OrderData = new OrderData();
  private _lastNoNameId = 1;

  public addPassenger(passenger: Passenger) {
    if (!passenger.id) {
      passenger.id = this._lastNoNameId.toString();
      this._lastNoNameId++;
    }
    this._orderData.passengers.push(passenger);
  }

  public removePassenger(id: string) {
    this._orderData.passengers = this._orderData.passengers.filter((x) => x.id !== id);
  }

  public getPassengers(): Passenger[] {
    return this._orderData.passengers;
  }

}

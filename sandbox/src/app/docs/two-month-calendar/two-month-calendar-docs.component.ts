import { DateAdapter } from '@angular/material';
import { Component } from '@angular/core';

@Component({
  selector: 'h21-two-month-calendar-docs',
  templateUrl: './two-month-calendar-docs.component.html',
})
export class TwoMonthCalendarDocsComponent {

  public title = 'Two month calendar component';

  public startDate: Date;
  public finishDate: Date;
  public startText: string;
  public finishText: string;

  public startDiapason: Date;
  public finishDiapason: Date;

  public withNights = {
    fromDate: null,
    toDate: null,
    nights: null,
  };

  constructor(private _dateAdapter: DateAdapter<Date>) {
    this.startText = 'Start';
    this.finishText = 'Finish';
    this.startDate = this._dateAdapter.addCalendarDays(new Date(), 1);
    this.finishDate = this._dateAdapter.addCalendarMonths(this.startDate, 1);


    this.startDiapason = new Date();
    this.finishDiapason = this._dateAdapter.addCalendarMonths(this.startDiapason, 1);
  }

  public updateStartDate($event) {
    this.startDate = $event;
  }

  public updateFinishDate($event) {
    this.finishDate = $event;
  }

}

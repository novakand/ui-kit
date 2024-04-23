import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Observable } from 'rxjs';

import { IClickEvent } from './click-event.interface';
import { DateTime } from './date-time.model';
import { Menu } from './menu.model';

enum DateFormat {
  DATE_TIME = 'datetime',
  TIME = 'time',
  DATE = 'date',
}

@Component({
  selector: 'h21-date-time-edit',
  templateUrl: './h21-date-time-edit.component.html',
  styleUrls: ['./h21-date-time-edit.component.scss'],
})
export class H21DateTimeEditComponent implements OnInit {

  @Input() public name: string;
  @Input() public readonly: boolean;
  @Input() public isRequired: boolean;
  @Input() public validationGroup: string;
  @Input() public validationMessage: string;
  @Input() public type: 'date' | 'time' | 'datetime';
  @Input() public getDates: () => Observable<DateTime[]>;

  @Output() public dateChange: EventEmitter<any> = new EventEmitter();

  public menus: any[] = [];
  public currentDate: Date;

  private _value: DateTime;

  get displayFormat(): string {
    switch (this.type) {
      case DateFormat.DATE_TIME:
        return 'shortDateShortTime';
      case DateFormat.TIME:
        return 'ShortTime';
      case DateFormat.DATE:
        return 'shortDate';
    }
  }

  @Input() get date(): DateTime {
    return this._value;
  }

  set date(value: DateTime) {
    if (!value) {
      return;
    }

    this._value = value;
    this.currentDate = this._toDate(this._value);
  }

  public ngOnInit(): void {
    if (!this.validationMessage) {
      this.validationMessage = 'Required';
    }

    if (this.getDates) {
      this.getDates()
        .subscribe({
          next: (collection) => this._buildMenuItems(collection),
        });
    }
  }

  public contextMenuItemClick(e: IClickEvent): void {
    if (e.itemData.action) {
      this.date = e.itemData.date;
      this.dateChange.emit(this.date);
      this.currentDate = this._toDate(this.date);
    }
  }

  public onValueChanged(e: any): void {
    if (e.value == null) {
      this.dateChange.emit(null);
    } else {
      this.date = this._toDateTime(e.value);
      this.dateChange.emit(this.date);
    }
  }

  private _buildMenuItems(collection: DateTime[]): void {
    this.menus = collection.map((item) => {
      return new Menu({
        date: item,
        icon: 'ion ion-md-time',
        action: (date: DateTime) => {
          this.date = date;
          this.dateChange.emit(this.date);
          this.currentDate = this._toDate(this.date);
        },
      });
    });
  }

  private _toDate(dateTime: DateTime): Date {
    return dateTime && new Date(
      dateTime.year,
      dateTime.month - 1,
      dateTime.day,
      dateTime.hour,
      dateTime.minute,
      dateTime.second,
    );
  }

  private _toDateTime(date: Date): DateTime {
    return date && new DateTime({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
    });
  }

}

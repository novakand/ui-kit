import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { H21TwoMonthCalendarComponent } from '../h21-two-month-calendar/h21-two-month-calendar.component';
import { AppSubscriberService } from '../../services/app-subscriber-service';
import { VocabularyService } from '../../services/vocabulary-service';
import { City } from '../../models';

@Component({
  selector: 'h21-fly-route-selection',
  templateUrl: './h21-fly-route-selection.component.html',
})
export class H21FlyRouteSelectionComponent implements OnInit {

  @Input() public routeNumber: number;
  @Input() public canAdd: boolean;
  @Input() public canRemove: boolean;
  @Input() public rangeDateMode: boolean;
  @Input() public minDate: Date;

  @Output() public cityFromChange: EventEmitter<City>;
  @Output() public cityToChange: EventEmitter<City>;
  @Output() public departureDateChange: EventEmitter<Date>;
  @Output() public returnDateChange: EventEmitter<Date>;
  @Output() public add: EventEmitter<void>;
  @Output() public remove: EventEmitter<void>;

  @ViewChild('calendar') public calendarControl: H21TwoMonthCalendarComponent;

  public maxDate: Date;
  public cityFromControl: FormControl;
  public cityToControl: FormControl;
  public filteredCities: Observable<City[]>;

  private _cityFrom: City;
  private _cityTo: City;
  private _departureDate: Date;
  private _returnDate: Date;

  @Input() get cityFrom(): City {
    return this._cityFrom;
  }
  set cityFrom(value: City) {
    this._cityFrom = value;
  }

  @Input() get cityTo(): City {
    return this._cityTo;
  }
  set cityTo(value: City) {
    this._cityTo = value;
  }

  @Input() get departureDate(): Date {
    return this._departureDate;
  }
  set departureDate(value: Date) {
    this._departureDate = value;
    this._appSubscriber.departureDateChanged({
      routeNumber: this.routeNumber,
      date: this._departureDate,
    });
  }

  @Input() get returnDate(): Date {
    return this._returnDate;
  }
  set returnDate(value: Date) {
    this._returnDate = value;
  }

  constructor(private _vocabulary: VocabularyService,
        private _appSubscriber: AppSubscriberService) {
    this.init();
  }

  public init(): void {
    this.routeNumber = 1;
    this.canAdd = true;
    this.canRemove = false;
    this.rangeDateMode = false;

    this.add = new EventEmitter<void>();
    this.remove = new EventEmitter<void>();
    this.cityToChange = new EventEmitter<City>();
    this.cityFromChange = new EventEmitter<City>();
    this.returnDateChange = new EventEmitter<Date>();
    this.departureDateChange = new EventEmitter<Date>();

    this.cityToControl = new FormControl('', Validators.required);
    this.cityFromControl = new FormControl('', Validators.required);
  }

  get invalid(): boolean {
    return this.cityFromControl.invalid || this.cityToControl.invalid || this.calendarControl.invalid;
  }

  public trackByFn(index) {
    return index;
  }

  public validate(): void {
    this.cityFromControl.updateValueAndValidity();
    this.cityToControl.updateValueAndValidity();
    this.cityFromControl.markAsTouched();
    this.cityToControl.markAsTouched();
    this.calendarControl.validate();
  }

  public ngOnInit() {
    this.cityFromControl.valueChanges
      .subscribe({
        next: (value) => {
          this.filteredCities = this._vocabulary.getCities(value);
        },
      });

    this.cityToControl.valueChanges
      .subscribe({
        next: (value) => {
          this.filteredCities = this._vocabulary.getCities(value);
        },
      });

    this._appSubscriber.departureDateObservable()
      .subscribe({
        next: (value) => {
          setTimeout(() => {
            if (value.routeNumber === this.routeNumber - 1) {
              this.minDate = value.date;
            } else if (value.routeNumber === this.routeNumber + 1) {
              this.maxDate = value.date;
            }
          });
        },
      });

    if (this.cityFrom) {
      this.cityFromControl.setValue(this.cityFrom);
    }
    if (this.cityTo) {
      this.cityToControl.setValue(this.cityTo);
    }
  }

  public displayCity(city: City): string {
    return city ? city.name : null;
  }

  public onSelectFromItem($event): void {
    if ($event) {
      this.cityFrom = $event.source.value;
      this.cityFromChange.emit(this._cityFrom);
    }
  }

  public onSelectToItem($event): void {
    if ($event) {
      this.cityTo = $event.source.value;
      this.cityToChange.emit(this._cityTo);
    }
  }

  public changeDepartureDate($event): void {
    if ($event) {
      this.departureDate = $event;
      this.departureDateChange.emit(this._departureDate);
    }
  }

  public changeReturnDate($event): void {
    if ($event) {
      this.returnDate = $event;
      this.returnDateChange.emit(this._returnDate);
    }
  }

  public swapCities(): void {
    const tmp = this._cityTo;
    this.cityTo = this._cityFrom;
    this.cityFrom = tmp;

    this.cityFromControl.setValue(this.cityFrom);
    this.cityToControl.setValue(this.cityTo);
    this.cityFromChange.emit(this._cityFrom);
    this.cityToChange.emit(this._cityTo);
  }

}

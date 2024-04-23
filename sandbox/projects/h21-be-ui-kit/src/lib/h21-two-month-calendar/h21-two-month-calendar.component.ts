import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats, MatDialog } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  LOCALE_ID,
  OnInit,
  Output
} from '@angular/core';

import { H21TwoMonthCalendarRangeViewMode } from './h21-two-month-calendar-range-view-mode.enum';
import { H21TwoMonthCalendarDialogComponent } from './h21-two-month-calendar-dialog.component';
import { UtilsService } from '../../services/utils.service';
import { Utils } from '../../services/utils';

@Component({
  selector: 'h21-two-month-calendar',
  templateUrl: './h21-two-month-calendar.component.html',
})
export class H21TwoMonthCalendarComponent implements OnInit {

  @Input() public required = false;
  @Input() public requiredErrorText = 'You must choose date';
  @Input() public rangeViewMode: H21TwoMonthCalendarRangeViewMode = H21TwoMonthCalendarRangeViewMode.Joint;
  @Input() public showWeekdayHint = false;

  @Input() public canSelectOneDate: boolean;
  @Input() public isSB: boolean;
  @Input() public rangeSelectMode: boolean;
  @Input() public startDate: Date;
  @Input() public finishDate: Date;
  @Input() public datePattern = 'MM.dd.yyyy';
  @Input() public maxRangeInDays: number;
  @Input() public fromDate: Date;
  @Input() public toDate: Date;
  @Input() public fromLabel: string;
  @Input() public toLabel: string;
  @Input() public formFieldAppearance: string;

  @Output() public selectedFromDateChange: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() public selectedToDateChange: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() public nightQuantityChange: EventEmitter<number> = new EventEmitter<number>();

  public nightQuantity: number = null;
  public fromFormControl: FormControl = new FormControl();
  public toFormControl: FormControl = new FormControl();

  public inFocus = false;
  public inFocusSecondField = false;

  private _selectedFromDate: Date;
  private _selectedToDate: Date;

  constructor(public dialog: MatDialog,
              public utils: UtilsService,
              private _dateAdapter: DateAdapter<Date>,
              @Inject(LOCALE_ID) private _locale: string,
              @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
  ) {
    this.rangeSelectMode = true;
    this.fromLabel = 'Departure date';
    this.toLabel = 'Return date';
    this.formFieldAppearance = 'legacy';
    this.startDate = this._dateAdapter.today();
    this.finishDate = this._dateAdapter.addCalendarYears(this.startDate, 1);
    this.fromDate = this._dateAdapter.clone(this.startDate);
    this.toDate = this._dateAdapter.clone(this.finishDate);
  }

  get selectedFromDate(): Date {
    return this._selectedFromDate && Utils.getUTCDate(this._selectedFromDate);
  }
  @Input() set selectedFromDate(value: Date) {
    if (value !== this._selectedFromDate) {
      this._selectedFromDate = value ? Utils.getDateWithOffset(value) : null;
      this.selectedFromDateChange.emit(this._selectedFromDate);
    }
  }
  get selectedToDate(): Date {
    return this._selectedToDate && Utils.getUTCDate(this._selectedToDate);
  }
  @Input() set selectedToDate(value: Date) {
    if (value !== this._selectedToDate) {
      this._selectedToDate = value ? Utils.getDateWithOffset(value) : null;
      this.selectedToDateChange.emit(this._selectedToDate);
    }
  }

  get invalid(): boolean {
    if (this.rangeSelectMode) {
      return this.selectedFromDate == null || this.selectedToDate == null;
    } else {
      return this.selectedFromDate == null;
    }
  }

  public ngOnInit() {
    if (this.required) {
      this.fromFormControl.setValidators(Validators.required);
      this.toFormControl.setValidators(Validators.required);
    }
    this.setFieldsValue();
  }

  public validate(): void {
    this.fromFormControl.updateValueAndValidity();
    this.toFormControl.updateValueAndValidity();
    this.fromFormControl.markAsTouched();
    this.toFormControl.markAsTouched();
  }

  public openDialog(): void {
    this.fromFormControl.markAsPending();
    this.toFormControl.markAsPending();

    const dialogRef = this.dialog.open(H21TwoMonthCalendarDialogComponent, {
      panelClass: 'c-h21-two-month-calendar_dialog',
      backdropClass: 'c-h21-two-month-calendar_dialog-backdrop',
      data: { // we pass the input parameters to initialize the calendar
        rangeSelectMode: this.rangeSelectMode,
        fromDateText: this.fromLabel,
        toDateText: this.toLabel,
        startDate: this.startDate,
        finishDate: this.finishDate,
        fromDate: this.fromDate,
        toDate: this.toDate,
        isSB: this.isSB,
        selectedFromDate: this.selectedFromDate,
        selectedToDate: this.selectedToDate,
        required: this.required,
        canSelectOneDate: this.canSelectOneDate,
        maxRangeInDays: this.maxRangeInDays,
      },
    });

    dialogRef.afterClosed()
      .subscribe((result) => { // subscribe to a dialog close event, get the values selected in the calendar
        if (result && result.selectedFromDate) {
          if (this.rangeSelectMode) {
            this.selectedFromDate = result.selectedFromDate;
            this.selectedToDate = result.selectedToDate;
          } else {
            this.selectedFromDate = result.selectedFromDate;
          }
          this.setNightsCount(result.selectedFromDate, result.selectedToDate);
        } else if (!this.required) {
          this.selectedFromDate = null;
          this.selectedToDate = null;
          this.setNightsCount();
        }
        this.setFieldsValue();
        if (this.required) {
          this.validate();
        }
      });
  }

  public setFieldsValue(): void {
    if (this.rangeSelectMode) {
      if (this.rangeViewMode === H21TwoMonthCalendarRangeViewMode.Joint) {
        const dateStr = this._getDateString();
        this.fromFormControl.setValue(dateStr);
      } else {
        this.fromFormControl.setValue(this.selectedFromDate ? formatDate(this.selectedFromDate, this.datePattern, this._locale) : '');
        this.toFormControl.setValue(this.selectedToDate ? formatDate(this.selectedToDate, this.datePattern, this._locale) : '');
      }
    } else {
      this.fromFormControl.setValue(this.selectedFromDate ? formatDate(this.selectedFromDate, this.datePattern, this._locale) : '');
    }
  }

  public setNightsCount(from?: Date, to?: Date): void {
    let nightQuantity;
    if (from && to) {
      const oneDayTime = 86400000; // let oneDayTime = 24 * 60 * 60 * 1000;
      const diffTime = to.getTime() - from.getTime();
      nightQuantity = diffTime / oneDayTime;
    } else {
      nightQuantity = null;
    }
    if (nightQuantity !== this.nightQuantity) {
      this.nightQuantity = nightQuantity;
      this.nightQuantityChange.emit(this.nightQuantity);
    }
  }

  public clear(): void {
    this.selectedFromDate = null;
    this.selectedToDate = null;
    this.setNightsCount();
    this.setFieldsValue();
    this.fromFormControl.markAsPending();
    this.toFormControl.markAsPending();
  }

  private _getDateString(): string {
    const fromDate = this.selectedFromDate ? formatDate(this.selectedFromDate, this.datePattern, this._locale) : '';
    const toDate = this.selectedToDate ? formatDate(this.selectedToDate, this.datePattern, this._locale) : '';
    const dash = this.selectedFromDate && this.selectedToDate ? '-' : '';
    const value = `${fromDate} ${dash} ${toDate}`;
    return value.trim().length ? value : null;
  }

}

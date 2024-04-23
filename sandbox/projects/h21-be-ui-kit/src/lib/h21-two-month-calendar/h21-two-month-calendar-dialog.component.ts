import { AfterViewInit, Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { DateAdapter, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
// external libs
import { Subject } from 'rxjs';
// models
import { ITwoMonthCalendarDialogData } from './models';
// services
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'h21-two-month-calendar-dialog',
  templateUrl: './h21-two-month-calendar-dialog.component.html',
})
export class H21TwoMonthCalendarDialogComponent implements OnInit, AfterViewInit {

  public monthNames: string[];
  public monthList: any[];
  public sliderItemsCount: number;
  public sliderItemsBoxWidth = 0;
  public sliderItemWidth = 0;
  public sliderCurrentIndex: number;
  public sliderCurrentIndexSubject = new Subject();
  public sliderCurrentTranslation = 0;
  public dayCells: any[];
  public calendarForm: FormGroup;
  public datePattern: string;

  private _monthShortNames: string[];
  private _dayShortNames: string[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ITwoMonthCalendarDialogData,
    public dialogRef: MatDialogRef<H21TwoMonthCalendarDialogComponent>,
    private _renderer: Renderer2,
    private _settings: SettingsService,
    private _dateAdapter: DateAdapter<Date>,
  ) {
    this.monthNames = this._dateAdapter.getMonthNames('long');
    this.monthList = this._getMonthList();
    this.sliderItemsCount = this._getMonthList().length;
    this.dayCells = [];
    this._monthShortNames = this._dateAdapter.getMonthNames('short');
    this._dayShortNames = this._dateAdapter.getDayOfWeekNames('short');
    this.datePattern = this.data.isSB ? 'dd MMM yyyy' : 'EEE, d LLL';
    let startIndex = 0;
    if (this.data.selectedFromDate) {
      startIndex = this._getMonthNumberInList(this.data.selectedFromDate);
      startIndex = startIndex === 1 ? 0 : startIndex === this.monthList.length - 1 ? startIndex - 1 : startIndex;
    }
    this.sliderCurrentIndex = startIndex;
    this.sliderCurrentIndexSubject.subscribe(() => setTimeout(() => this._updateDayCells(), 0));
  }

  public ngOnInit(): void {
    this.calendarForm = new FormGroup({
      dateStart: new FormControl('', []),
      dateEnd: new FormControl('', []),
    });
  }

  public ngAfterViewInit() {
    const elementView = document.getElementById('calendar-dialog-body');
    if (elementView) {
      this.sliderItemsBoxWidth = elementView.clientWidth;
      this.sliderItemWidth = this.sliderItemsBoxWidth / this.sliderItemsCount;
      this._init();
    }
  }

  public trackByFn(index) { return index; }

  public closeDialog() {
    const { selectedFromDate, selectedToDate } = this.data;
    const result = { selectedFromDate, selectedToDate };
    this.dialogRef.close(result);
  }

  public getMonthName(monthNumber): string {
    return monthNumber >= 0 && monthNumber <= 11 ? this.monthNames[monthNumber] : 'undefined';
  }

  public getMonthFirstDay(month: number, year: number): Date {
    return this._dateAdapter.createDate(year, month, 1);
  }

  public prevSlide() {
    this.sliderCurrentIndex--;
    this.sliderCurrentIndexSubject.next(this.sliderCurrentIndex);
    this._moveSlide();
  }

  public nextSlide() {
    this.sliderCurrentIndex++;
    this.sliderCurrentIndexSubject.next(this.sliderCurrentIndex);
    this._moveSlide();
  }

  public prevDay(date: Date) {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    if (d >= this.data.fromDate && this._isLessThenMaxRange(d)) {
      this._unMarkSelectedCell(date);
      date.setDate(date.getDate() - 1);
      if (this.data.selectedToDate && this.data.selectedToDate.getTime() === this.data.selectedFromDate.getTime()) {
        this.clearSelection();
        return;
      }
      if (this.data.selectedToDate) {
        this.data.selectedToDate = new Date(this.data.selectedToDate);
      }
      this.data.selectedFromDate = new Date(this.data.selectedFromDate);
      const newDateSlideIndex = this._getMonthNumberInList(date);
      if (Math.abs(newDateSlideIndex - this.sliderCurrentIndex) > 0) {
        this._moveToSlide(newDateSlideIndex === 0 ? 0 : newDateSlideIndex - 1);
      } else {
        this._highlightRange();
        this._markSelectedCell(date);
      }
    }
  }

  public nextDay(date: Date) {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    if (d <= this.data.toDate) {
      this._unMarkSelectedCell(date);
      date.setDate(date.getDate() + 1);
      const corrected = this._correctToDate(date, this.data.selectedFromDate);
      date.setTime(corrected.getTime());
      if (this.data.selectedToDate && this.data.selectedToDate.getTime() === this.data.selectedFromDate.getTime()) {
        this.clearSelection();
        return;
      }
      if (this.data.selectedToDate) {
        this.data.selectedToDate = new Date(this.data.selectedToDate);
      }
      this.data.selectedFromDate = new Date(this.data.selectedFromDate);
      const newDateSlideIndex = this._getMonthNumberInList(date);
      if (Math.abs(newDateSlideIndex - this.sliderCurrentIndex) > 1) {
        this._moveToSlide(newDateSlideIndex - 1);
      } else {
        this._highlightRange();
        this._markSelectedCell(date);
      }
    }
  }

  public selectedDateChange($event): void {
    if (!this.data.rangeSelectMode) {
      if (this.data.selectedFromDate) {
        this._unMarkSelectedCell(this.data.selectedFromDate);
      }
      this.data.selectedFromDate = $event;
      this._markSelectedCell(this.data.selectedFromDate);
      return;
    }
    if (this.data.selectedFromDate === $event) { return; }
    if (this.data.selectedFromDate > $event) {
      this.clearSelection();
      return;
    }
    if (!this.data.selectedFromDate) {
      this.data.selectedFromDate = $event;
      this._markSelectedCell(this.data.selectedFromDate);
    } else {
      if (this.data.selectedToDate && this._checkDateInDayCells(this.data.selectedToDate)) {
        this._unMarkSelectedCell(this.data.selectedToDate);
      }
      this.data.selectedToDate = this._correctToDate($event, this.data.selectedFromDate);
      this._highlightRange();
      this._markSelectedCell(this.data.selectedToDate);
    }
  }

  public clearSelection() {
    this.data.selectedFromDate = null;
    this.data.selectedToDate = null;
    this._unMarkSelected();
    this._clearHighlight();
  }

  public checkCompletePossibility(): boolean {
    if (this.data.required) {
      if (this.data.rangeSelectMode && this.data.canSelectOneDate) {
        return this.data.selectedFromDate != null || this.data.selectedToDate != null;
      } else if (this.data.rangeSelectMode) {
        return (this.data.selectedFromDate != null && this.data.selectedToDate != null);
      } else {
        return this.data.selectedFromDate != null;
      }
    }
    return true;
  }

  private _getArialLabel(d: Date): string {
    const month = this._monthShortNames[d.getMonth()];
    const day = this._dayShortNames[d.getDay()];
    return `${day} ${month} ${this._padLeft(d.getDate(), 2)} ${d.getFullYear()}`;
  }

  private _padLeft(n: number, size: number): string {
    let result = n.toString();
    while (result.length < size) { result = `0${result}`; }
    return result;
  }

  private _getMonthList() {
    const result = [];
    let tmpDate = this._dateAdapter.clone(this.data.startDate);
    while (tmpDate <= this.data.finishDate) {
      result.push({ month: tmpDate.getMonth(), year: tmpDate.getFullYear() });
      tmpDate = this._dateAdapter.addCalendarMonths(tmpDate, 1);
    }
    return result;
  }

  private _getMonthNumberInList(date: Date): number {
    const month = date.getMonth();
    const year = date.getFullYear();
    for (let i = 0; i < this.monthList.length; i++) {
      if (this.monthList[i].month === month && this.monthList[i].year === year) {
        return i;
      }
    }
    return 0;
  }

  private _init() {
    this._updateDayCells();
    if (this.data.selectedFromDate && this.sliderCurrentIndex > 1) {
      this._moveToSlide(this.sliderCurrentIndex);
    }
  }

  private _updateDayCells() {
    if (this.dayCells.length > 0) {
      this.dayCells.length = 0;
    }
    this.dayCells = Array.from(document.querySelectorAll('.mat-calendar-body-cell')).map((x: any) => {
      const xDate = new Date(x.getAttribute('aria-label'));
      return {
        element: x,
        date: xDate,
        arialLabel: x.getAttribute('aria-label'),
        isHover: false,
      };
    });

    this._highlightRange();
    if (this.data.selectedFromDate && this._checkDateInDayCells(this.data.selectedFromDate)) {
      this._markSelectedCell(this.data.selectedFromDate);
    }
    if (this.data.selectedToDate && this._checkDateInDayCells(this.data.selectedToDate)) {
      this._markSelectedCell(this.data.selectedToDate);
    }

    this.dayCells.forEach((item) => item.element.addEventListener('mouseover', () => this._dynamicHighlight(item.date)));

    if (this.data.rangeSelectMode) {
      const elements = Array.from(document.querySelectorAll('.mat-calendar-body'));
      elements.forEach((item) => {
        item.addEventListener('mouseleave', () => {
          if (this.data.selectedFromDate && !this.data.selectedToDate) {
            this._clearHighlight();
          }
        });
      });
    }
  }

  private _checkDateInDayCells(d: Date) {
    if (this.dayCells && this.dayCells.length > 0) {
      return this.dayCells.some((item) => {
        const date1 = this._dateAdapter.clone(item.date).setHours(0, 0, 0, 0);
        const date2 = this._dateAdapter.clone(d).setHours(0, 0, 0, 0);
        return date1 === date2;
      });
    }
    return false;
  }

  private _markSelectedCell(d: Date) {
    const { rangeSelectMode, selectedFromDate } = this.data;
    if (this._checkDateInDayCells(d)) {
      const ariaLabel = this._getArialLabel(d);
      const cell = this.dayCells.find((item) => item.arialLabel === ariaLabel);
      if (cell) {
        cell.element.classList.add('c-h21-two-month-calendar_selected');
        if (rangeSelectMode) {
          const isEqualDates = () => d.getTime() === selectedFromDate.getTime();
          const elClass = isEqualDates() ? 'c-h21-two-month-calendar_selected__start' : 'c-h21-two-month-calendar_selected__finish';
          cell.element.classList.add(elClass);
        }
      }
    }
  }

  private _unMarkSelectedCell(d: Date) {
    if (this._checkDateInDayCells(d)) {
      const ariaLabel = this._getArialLabel(d);
      const cell = this.dayCells.find((item) => item.arialLabel === ariaLabel);
      if (cell) {
        cell.element.classList.remove('c-h21-two-month-calendar_selected');
        cell.element.classList.remove('c-h21-two-month-calendar_selected__start');
        cell.element.classList.remove('c-h21-two-month-calendar_selected__finish');
      }
    }
  }

  private _unMarkSelected() {
    const elements = Array.from(document.querySelectorAll('.c-h21-two-month-calendar_selected'));
    elements.forEach((item) => {
      item.classList.remove('c-h21-two-month-calendar_selected');
      item.classList.remove('c-h21-two-month-calendar_selected__start');
      item.classList.remove('c-h21-two-month-calendar_selected__finish');
    });
  }

  private _clearHighlight() {
    this.dayCells.forEach((item) => {
      item.isHover = false;
      item.element.classList.remove('c-h21-two-month-calendar_range-highlight');
      item.element.classList.remove('c-h21-two-month-calendar_range-highlight__finish');
    });
  }

  private _highlightRange(d: Date = null) {
    if (!d) { d = this.data.selectedToDate; }
    if (this.data.rangeSelectMode && this.data.selectedFromDate && d) {
      const fromDate = this._dateAdapter.clone(this.data.selectedFromDate).setHours(0, 0, 0, 0);
      const toDate = this._correctToDate(d, this.data.selectedFromDate).setHours(0, 0, 0, 0);
      this.dayCells.forEach((item) => {
        const cellDate = this._dateAdapter.clone(item.date).setHours(0, 0, 0, 0);
        if (cellDate >= fromDate && cellDate <= toDate) {
          item.isHover = true;
          item.element.classList.add('c-h21-two-month-calendar_range-highlight');
          if (cellDate === toDate) {
            item.element.classList.add('c-h21-two-month-calendar_range-highlight__finish');
          } else {
            item.element.classList.remove('c-h21-two-month-calendar_range-highlight__finish');
          }
        } else {
          item.isHover = false;
          item.element.classList.remove('c-h21-two-month-calendar_range-highlight');
        }
      });
    }
  }

  private _correctToDate(date: Date, start: Date): Date {
    if (!this.data.maxRangeInDays) { return date; }

    const end = new Date(start.getTime());
    end.setDate(start.getDate() + this.data.maxRangeInDays);

    if (date.getTime() > end.getTime()) { return end; }
    return date;
  }

  private _dynamicHighlight(d: Date) {
    const { rangeSelectMode, selectedFromDate, selectedToDate } = this.data;
    if (!rangeSelectMode || selectedFromDate || selectedToDate) { return; }
    this._highlightRange(d);
  }

  private _moveSlide() {
    const elementView = document.getElementById('calendar-dialog-body');
    this.sliderCurrentTranslation = this.sliderCurrentIndex * this.sliderItemWidth;
    this._renderer.setStyle(elementView, 'transform', `translateX(${String(-this.sliderCurrentTranslation)}px)`);
  }

  private _moveToSlide(slideNumber: number) {
    this.sliderCurrentIndex = slideNumber;
    this.sliderCurrentIndexSubject.next(this.sliderCurrentIndex);
    this._moveSlide();
  }

  private _isLessThenMaxRange(date: Date): boolean {
    const { selectedToDate, maxRangeInDays } = this.data;
    if (selectedToDate && maxRangeInDays) {
      const toDate = selectedToDate.getTime();
      const fromDate = date.getTime();
      const diff = Math.floor((toDate - fromDate) / (1000 * 60 * 60 * 24));
      return diff < (maxRangeInDays + 1);
    }
    return true;
  }

}

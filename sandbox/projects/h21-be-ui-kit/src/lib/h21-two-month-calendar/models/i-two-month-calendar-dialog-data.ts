export interface ITwoMonthCalendarDialogData {
  rangeSelectMode: boolean;
  fromDateText: string;
  toDateText: string;
  startDate: Date;
  finishDate: Date;
  fromDate: Date;
  toDate: Date;
  selectedFromDate: Date;
  selectedToDate: Date;
  required: boolean;
  canSelectOneDate: boolean;
  maxRangeInDays: number;
  isSB?: boolean;
}

import {
  Component,
  EventEmitter,
  forwardRef,
  Input, OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ThemePalette } from '@angular/material';

import { debounceTime, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { HttpClientService } from '../../services/http-client.service';
import { Query } from '../../models';

@Component({
  selector: 'h21-autocomplete',
  templateUrl: './h21-autocomplete.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => H21AutocompleteComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => H21AutocompleteComponent),
      multi: true,
    },
  ],
})
export class H21AutocompleteComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor, Validator {

  get value() { return this._value; }
  @Input() set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      if (this._value) {
        setTimeout(this._initValue.bind(this), 30);
      }
    }
  }

  get dataSource() { return this._dataSource; }
  @Input() set dataSource(value: any[]) {
    if (this._dataSource !== value) {
      this._dataSource = value;
      this._resetFilteredOptions();
      if (this.dataSource && this.dataSource.length > 0) {
        setTimeout(this._setValueFromDataSource.bind(this), 30);
      }
    }
  }

  protected defaultFieldClass = 'h21-form-field';
  protected defaultPanelClass = 'h21-autocomplete-panel';

  @Input() public valueChanged: Subject<any> = new Subject();
  @Input() public disabled: boolean;
  @Input() public placeholder: string;
  @Input() public valueField: string;
  @Input() public displayField = 'name';
  @Input() public descriptionField: string;
  @Input() public iconField: string;
  @Input() public dataUrl: string;
  @Input() public dataProcess: Function;
  @Input() public isLoadDataByPostQuery = true;
  @Input() public dataFilter: any;
  @Input() public filterField = 'nameContains';
  @Input() public iconSuffix: string;
  @Input() public valRequired: string;
  @Input() public valPattern: string;
  @Input() public color: ThemePalette;                                                // theme color palette for the mat-form-field element.
  @Input() public fieldClass: string;                                                 // css class for mat-form-field element.
  @Input() public panelClass: string;                                                 // css class for mat-autocomplete element.
  @Input() public diasbleDefaultCssClasses = false;                                   // disables the use of default styles.
  @Input() public formFieldAppearance: string;
  @Output() public valueChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() public changeValueControl: EventEmitter<any> = new EventEmitter<any>();

  public filteredOptions: Observable<any[]>;
  public inputControl = new FormControl();

  private _value: any;
  private _dataSource: any[];
  private _destroy$ = new Subject<boolean>();

  constructor(private _http: HttpClientService) {
    this.formFieldAppearance = 'legacy';
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataFilter && changes.dataFilter.currentValue) {
      this.dataFilter = changes.dataFilter.currentValue;
    }
  }

  public ngOnInit() {
    this._initSearchOptions();

    this.valueChanged.subscribe(() => {
      this._setValueFromDataSource(true);
    });

    if (!this.diasbleDefaultCssClasses) {
      this.fieldClass = this.defaultFieldClass + (!this.fieldClass ? '' : ` ${this.fieldClass}`);
      this.panelClass = this.defaultPanelClass + (!this.panelClass ? '' : ` ${this.panelClass}`);
    }
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public onTouched = () => {};
  public onChange = (value: any) => {};

  public registerOnChange(fn: any): void { this.onChange = fn; }
  public registerOnTouched(fn: any): void { this.onTouched = fn; }
  public setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  public writeValue(value: any): void {
    this._value = value;

    if (value) {
      this.onChange(value);
    } else {
      this.inputControl.setValue(null);
    }
  }

  public onInputChange(value: any) {
    if (!value) {
      this._value = null;
      this.onChange(null);
    }
    this.changeValueControl.emit(value);
  }

  public trackByFn(index) {
    return index;
  }

  public setDisplayValue(value: string): void {
    this.inputControl.setValue(value);
    this.inputControl.markAsUntouched();
  }

  public validate(control: AbstractControl): ValidationErrors {
    if (this.valRequired) {
      this.inputControl[control.touched ? 'markAsTouched' : 'markAsUntouched']();
      if (!control.value) {
        this.inputControl.setValue(null);
        return { required: true };
      }
    }
    return null;
  }

  public getLabel(value: any): string {
    if (!value) {
      return '';
    }
    return (typeof value === 'string') || (typeof value === 'number') ? value : value[this.displayField];
  }

  public displayFn(data?: any): any {
    return data ? this.getLabel(data) : undefined;
  }

  public optionSelected(event: MatAutocompleteSelectedEvent): void {
    const value = this.valueField
      ? event.option.value[this.valueField]
      : event.option.value;
    this._setValue(value);
    this.writeValue(value);
  }

  private _initValue() {
    if (!this._value || this.inputControl.value || !this.valueField) {
      return;
    }

    if (!this.dataUrl || !this.isLoadDataByPostQuery) {
      this._setValueFromDataSource();
      return;
    }

    const filter = new Query({
      take: 1,
      filter: this.dataFilter || {},
    });

    filter.filter[this.valueField] = this._value;

    this
      ._postData(this.dataUrl, filter)
      .pipe(
        map((x) => this._applyDataProcess(x.items)),
        takeUntil(this._destroy$),
       )
      .subscribe((items) => {
        if (items && items.length === 1) {
          this.inputControl.setValue(items[0][this.displayField]);
        }
      });
  }

  private _setValueFromDataSource(refresh = false) {
    if ((!this._value || this.inputControl.value) && !refresh) {
      return;
    }

    const item = this.dataSource.find((e) =>  this.valueField ? e[this.valueField] === this._value : e === this._value);
    item && this.inputControl.setValue(item[this.displayField]);
  }

  private _postData(url: string, filter: any): Observable<any> {
    return this._http.post<any>(url, filter);
  }

  private _getData(url: string): void {
    this._http.get<any>(url)
      .subscribe({
        next: (e) => {
          this._dataSource = this._applyDataProcess(e);
        },
      });
  }

  private _getFilter(value: string): any {
    const filter = this.dataFilter;
    filter[this.filterField] = value;

    return {
      take: 10,
      filter: filter,
    };
  }

  private _remoteFilter(value: any): Observable<any[]> {
    return this._postData(this.dataUrl, this._getFilter(value))
      .pipe(map((x) => this._applyDataProcess(x.items)));
  }

  private _localFilter(value: any): any[] {
    const filterValue = value.toLowerCase();
    return this.dataSource.filter((option) =>
      option[this.displayField].toLowerCase().includes(filterValue));
  }

  private _setValue(value: any): void {
    if (this._value !== value) {
      this.onChange(value);
      this.valueChange.emit(value);
    }
  }

  private _applyDataProcess(data: any[]): any[] {
    if (!this.dataProcess) {
      return data;
    }
    return data.map((e) => this.dataProcess(e));
  }

  private _initSearchOptions(): void {
    // remote search
    if (this.dataUrl) {
      if (this.isLoadDataByPostQuery) {
        this.filteredOptions = this.inputControl.valueChanges
          .pipe(
            debounceTime(300),
            map((value) => this.getLabel(value)),
            switchMap((x) => this._remoteFilter(x)),
            takeUntil(this._destroy$),
          );
      } else { this._getData(this.dataUrl); }
      return;
    }
    // dataSource search
    this.filteredOptions = this.inputControl.valueChanges
      .pipe(
        startWith(''),
        map((value) => this.getLabel(value)),
        map((x) => this._localFilter(x)),
        takeUntil(this._destroy$),
      );
  }

  private _resetFilteredOptions(): void {
    this.inputControl.reset();
  }

}

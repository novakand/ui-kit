import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';

import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { IComboboxOption } from '../../interfaces/combobox-option.interface';

@Component({
  selector: 'h21-combobox',
  templateUrl: './h21-combobox.component.html',
})

export class H21ComboboxComponent implements OnInit {

  @Input() public disabled: boolean;
  @Input() public placeholder: string;
  @Input() public value: any;
  @Input() public tooltipText: string;
  @Input() public xPosition: 'before' | 'after' = 'after';
  @Input() public options: IComboboxOption[];
  @Input() public optionsUrl: string;

  @Output() public selected: EventEmitter<any> = new EventEmitter<any>();

  public filteredOptions: Observable<IComboboxOption[]>;
  public filterControl = new FormControl();
  public filteredOptionCount: number;
  public selectedOption: IComboboxOption;

  constructor(private _http: HttpClient) { }

  public ngOnInit() {
    if (!this.options && this.optionsUrl) {
      this.options = this.getData(this.optionsUrl);
    }
    const index = this.value ? this.options.findIndex((item) => item.value === this.value) : 0;
    this.selectedOption = index !== -1 ? this.options[index] : this.options[0];
    this.filteredOptions = this.filterControl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value)),
      );
  }

  public trackByFn(index) {
    return index;
  }

  public getData(url: string): IComboboxOption[] {
    let options: IComboboxOption[] = [];
    this._http.get<any>(url).subscribe({
      next: (data) => {
        options = data;
      },
    });
    return options;
  }

  public dropBoxClosed(event: any): void {
    this.filterControl.setValue('');
  }

  public selectOption(val: any): void {
    this.value = val;
    this.selectedOption = this.options.find((item) => item.value === this.value);
    this.selected.emit(this.value);
  }

  private _filter(value: string): IComboboxOption[] {
    const filterValue = value.toLowerCase();
    const filteredOptions = this.options.filter((option) => option.optionLabel.toLowerCase().includes(filterValue));
    this.filteredOptionCount = filteredOptions.length;
    return filteredOptions;
  }

}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ThemePalette } from '@angular/material';
import { FormControl } from '@angular/forms';

import { HttpClientService } from '../../services/http-client.service';

@Component({
  selector: 'h21-select',
  templateUrl: './h21-select.component.html',
})
export class H21SelectComponent implements OnInit {

  @Input() public disabled: boolean;
  @Input() public placeholder: string;
  @Input() public valueField: string;
  @Input() public displayField = 'name';
  @Input() public descriptionField: string;
  @Input() public dataSource: any[] = [];
  @Input() public dataUrl: string;
  @Input() public dataFilter: any;
  @Input() public iconSuffix: string;
  @Input() public valRequired: string;
  @Input() public color: ThemePalette;                                            // theme color palette for the mat-form-field element.
  @Input() public fieldClass: string;                                             // css class for mat-form-field element.
  @Input() public panelClass: string;                                             // css class for mat-autocomplete element.
  @Input() public diasbleDefaultCssClasses = false;                               // disables the use of default styles.

  @Output() public valueChange: EventEmitter<any> = new EventEmitter<any>();

  protected defaultFieldClass = 'h21-form-field';
  protected defaultPanelClass = 'h21-select-panel';

  public inputControl = new FormControl({ value: '', disabled: this.disabled });

  private _value: any;

  constructor(private _http: HttpClientService) { }

  get value(): any {
    return this._value;
  }
  @Input() set value(value: any) {
    this._value = value;
    this.inputControl.setValue(value);
  }

  public ngOnInit() {
    if (this.dataUrl) {
      this._getData(this.dataUrl);
    }

    if (!this.diasbleDefaultCssClasses) {
      this.fieldClass = this.defaultFieldClass + (!this.fieldClass ? '' : ` ${this.fieldClass}`);
      this.panelClass = this.defaultPanelClass + (!this.panelClass ? '' : ` ${this.panelClass}`) ;
    }
  }

  public trackByFn(index) {
    return index;
  }

  public clear(): void {
    this.setDisplayValue('');
    this._setValue(null);
  }

  public setDisplayValue(value: string): void {
    this.inputControl.setValue(value);
    this.inputControl.markAsUntouched();
  }

  public validate(): void {
    this.inputControl.updateValueAndValidity();
    this.inputControl.markAsTouched();
  }

  public getValue(value: any): string {
    if (value === null || value === undefined) {
      return value;
    }
    return this.valueField ? value[this.valueField] : value;
  }

  public getLabel(value: any): string {
    if (value == null || value === undefined) {
      return '';
    }
    return (typeof value === 'string') || (typeof value === 'number') ? value : value[this.displayField];
  }

  public optionSelected(event: MatSelectChange): void {
    this._setValue(event.value);
  }

  private _getData(url: string): void {
    this._http.get<any>(url)
      .subscribe((e) => this.dataSource = e);
  }

  private _setValue(value: any): void {
    this._value = value;
    this.valueChange.emit(this._value);
  }

}

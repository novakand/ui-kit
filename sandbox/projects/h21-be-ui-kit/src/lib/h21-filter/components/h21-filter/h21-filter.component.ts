import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input, OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

// models
import { BaseControl } from '../../models/base-control';

// services
import { H21FilterService } from '../../services/h21-filter.service';
import { CountriesAutocompleteService } from '../../../../services/countries-autocomplete.service';

// interfaces
import { ICountry } from '../../../../interfaces/country.interface';

// validator
import { FormCustomValidators } from '../../../../models/autocomplete.validator.model';

@Component({
  selector: 'h21-filter',
  templateUrl: './h21-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CountriesAutocompleteService],
})
export class H21FilterComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() public controls: BaseControl[] = [];
  @Output() public emitSubmit = new EventEmitter();

  public countries$: Observable<ICountry[]>;
  public form: FormGroup;

  private country: BaseControl;
  private _destroy$ = new Subject<boolean>();
  @ViewChild('countryData') private _countryData: ElementRef;

  constructor(
    private _h21FilterService: H21FilterService,
    private _countriesAutocompleteService: CountriesAutocompleteService,
  ) {}

  public ngOnInit(): void {
    this.form = this._h21FilterService.buildFormGroup(this.controls);

    this.country = this.controls.find(({ key }) => key === 'countryCode');
    this.country && this._getCountry(this.country.value);
  }

  public ngAfterViewInit(): void {
    this.countries$ = this._countriesAutocompleteService.getCountries(this._countryData)
      .pipe(
        tap((countries) => {
          this.form.get('countryCode').setValidators([FormCustomValidators.valueSelected(countries, 'code')]);
          this.form.get('countryCode').updateValueAndValidity();
        }),
      );
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public trackByFn(index): number {
    return index;
  }

  public displayFn(item: string): string {
    return item && this._countriesAutocompleteService.getCountryName(item);
  }

  public setPickerValue(data: string, field: string): void {
    this.form.get(field).setValue(data);
  }

  public submit(): void {
    this.emitSubmit.emit(this.form.value);
  }

  public reset(): void {
    this.form.reset();
  }

  private _getCountry(countryCode: any): void {
    this._countriesAutocompleteService.getCountry(countryCode).pipe(takeUntil(this._destroy$))
      .subscribe(() => this.form.patchValue({ countryCode: this.country.value }));
  }

}

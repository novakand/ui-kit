import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// services
import { SysadminVocabularyService } from '../../../../services/sysadmin-vocabulary.service';
import { CompanyService } from '../../services/company.service';
import { Utils } from '../../../../services/utils';
import { CountriesAutocompleteService } from '../../../../services/countries-autocomplete.service';

// tokens & refs
import { FILTER_DIALOG_DATA } from './company-filter.tokens';
import { CompanyFilterRef } from './company-filter-ref';

// interfaces
import { ICountry } from '../../../../interfaces/country.interface';

// models
import { CompanyActualContract } from '../../models/company-status.model';
import { CompanyFilter } from './company-filter.model';
import { CompanyState } from '../../models/company-state.model';
import { Query } from '../../../../models/query.model';

// animation
import { CompanyFilterAnimation } from '../../../../animations/company-filter';

@Component({
  selector: 'h21-company-filter',
  templateUrl: './company-filter.component.html',
  animations: CompanyFilterAnimation,
  providers: [CountriesAutocompleteService],
})
export class CompanyFilterComponent implements OnInit, AfterViewInit, OnDestroy {

  public animationState: 'void' | 'enter' | 'leave' = 'enter';
  public animationStateChanged = new EventEmitter<AnimationEvent>();

  public form: FormGroup;

  public countries$: Observable<ICountry[]>;
  public companyStates: CompanyState[];
  public companyActualContractStates: CompanyActualContract[];

  @ViewChild('countryData') private _countryData: ElementRef;
  @ViewChild('container') private _container: ElementRef;
  @ViewChild('select') private _select;

  private _destroy$ = new Subject<boolean>();

  constructor(
    private _countriesAutocompleteService: CountriesAutocompleteService,
    private _fb: FormBuilder,
    private _dialogRef: CompanyFilterRef,
    private _companyService: CompanyService,
    public vocabulary: SysadminVocabularyService,
    @Inject(FILTER_DIALOG_DATA) private _filter: CompanyFilter,
  ) {}

  public ngOnInit(): void {
    this.countries$ = this._countriesAutocompleteService.getCountries(this._countryData);
    this._buildForm();

    this._getStates();
    this.companyActualContractStates = this._companyService.getCompanyActualContractStates();

    const { countryCode } = this._filter;
    countryCode ? this._getCountry(countryCode) : this._fillForm();
  }

  public ngAfterViewInit() {
    this._container.nativeElement.focus();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public trackByFn(index) {
    return index;
  }

  public displayFn(item: string): string {
    return item && this._countriesAutocompleteService.getCountryName(item);
  }

  public resetFocus(): void {
    this._select.close();
  }

  public onAnimation(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  public startExitAnimation(): void {
    this.animationState = 'leave';
  }

  public onDateChanged(control: string, event): void {
    this.form.get(control).setValue(Utils.getDateWithOffset(event.value));
  }

  public clear(): void {
    this.form.reset();
  }

  public submit(): void {
    this._checkCountries();
    this._dialogRef.close(this.form.value);
  }

  public close(): void {
    this._dialogRef.close();
  }

  private _checkCountries(): void {
    const countries: number[] = this.form.get('countryIdIn').value;
    (countries && !countries.length) && this.form.get('countryIdIn').setValue(null);
  }

  private _getStates(): void {
    const filter = new Query({ withCount: false });

    this._companyService.getStateList(filter).pipe(takeUntil(this._destroy$))
      .subscribe((states) => this.companyStates = states);
  }

  private _buildForm(): void {
    this.form = this._fb.group({
      shortNameContains: new FormControl(),
      typeIdIn: new FormControl(),
      countryIdIn: new FormControl(),
      countryCode: new FormControl(),
      innExpr: new FormControl(),
      stateIdIn: new FormControl(),
      hasActualContract: new FormControl(),
      createDateGreaterEqual: new FormControl(),
      createDateLessEqual: new FormControl(),
      updateDateGreaterEqual: new FormControl(),
      updateDateLessEqual: new FormControl(),
    });
  }

  private _getCountry(countryCode: string): void {
    this._countriesAutocompleteService.getCountry(countryCode).pipe(takeUntil(this._destroy$))
      .subscribe(() => this._fillForm());
  }

  private _fillForm(): void {
    this.form.patchValue(this._filter);
  }

}

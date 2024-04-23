import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewRef,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, Subject } from 'rxjs';

// services
import { SysadminVocabularyService } from '../../../../services/sysadmin-vocabulary.service';
import { ToolbarActionsService } from '../../../../services/toolbar-actions.service';
import { LoadProgressService } from '../../../../services/load-progress.service';
import { CompanySettingService } from '../../services/company-setting.service';
import { HttpClientService } from '../../../../services/http-client.service';
import { ReferencesService } from '../../../../services/references.service';
import { SettingsService } from '../../../../services/settings.service';
import { CompanyService } from '../../services/company.service';

// models
import { ProfileName } from '../../company-profile-setting.model';

// interfaces
import { ICountry } from '../../../../interfaces/country.interface';
import { ICompany } from '../../interfaces/company.interface';

// enums
import { CountryType, ViewMode } from '../../../../enums';

// utils
import { Utils } from '../../../../services/utils';

@Component({
  selector: 'h21-general-info',
  templateUrl: './general-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ReferencesService,
      useClass: ReferencesService,
      deps: [
        HttpClientService,
        SettingsService,
      ],
    },
  ],
})
export class GeneralInfoComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public isAdmin: boolean;
  @Input() public validate: boolean;
  @Input() public company: ICompany;
  @Input() public profile: ProfileName;
  @Input() public mode: ViewMode;
  @Input() public isEditable: string[] = ['description', 'email', 'invoiceEmail', 'voucherEmail', 'phone', 'fax', 'homePage'];

  @Output() public emitMode: EventEmitter<ViewMode> = new EventEmitter<ViewMode>();
  @Output() public emitCompany: EventEmitter<ICompany> = new EventEmitter<ICompany>();

  public actionInProgress: boolean;
  public form: FormGroup;
  public modeType = ViewMode;

  public countries$: Observable<ICountry[]> = this._referencesService.getCountries();

  public countryType: CountryType;
  public countryTypes = CountryType;

  private _originCompany: ICompany;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _companyService: CompanyService,
    private _setting: CompanySettingService,
    public vocabulary: SysadminVocabularyService,
    private _referencesService: ReferencesService,
    private _toolbarActions: ToolbarActionsService,
    private _loadProgressService: LoadProgressService,
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.mode && changes.mode.currentValue) {
      this.mode = changes.mode.currentValue;
    }

    if (changes.company && changes.company.currentValue) {
      this.company = changes.company.currentValue;
      this.form && this.form.patchValue(this.company);
    }
  }

  public ngOnInit(): void {
    setTimeout(() => this._setToolbarActions(), 0);
    this._buildForm();
    this._originCompany = Utils.deepCopy(this.company);
    this.form.patchValue(this.company);

    this.validate && this._markFormGroupTouched(this.form);
    this._setCountryType(this.company.countryCode);
    this._updateControlAccess();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public trackByFn(index: number): number {
    return index;
  }

  public save(): void {
    if (this.actionInProgress) {
      return;
    }

    if (this.form.invalid) {
      this._markFormGroupTouched(this.form);
      return;
    }

    this.actionInProgress = true;
    this._loadProgressService.show(1);
    this.mode = ViewMode.View;
    this.emitMode.emit(this.mode);

    this._updateControlAccess();
    this._setToolbarActions();

    this._companyService.save(this.form.getRawValue())
      .subscribe({
        next: (data) => {
          this.actionInProgress = false;
          this._loadProgressService.hide(1);
          Object.assign(this.company, data);
          this._originCompany = { ...this.company };
          this.emitCompany.emit(this._originCompany);
          this.form.patchValue(data);
        },
      });
  }

  public isInvalid(): boolean {
    this._updateControlAccess();
    this._markFormGroupTouched(this.form);
    return this.form.invalid;
  }

  public isEditableField(name): boolean {
    return this.isEditable.findIndex((val) => val === name) >= 0;
  }

  private _buildForm(): void {
    this.form = this._fb.group({
      shortName: new FormControl({ value: null, disabled: true }),
      countryCode: new FormControl({ value: null, disabled: true }),
      inn: new FormControl({ value: null, disabled: true }),
      kpp: new FormControl({ value: null, disabled: true }),
      ogrn: new FormControl({ value: null, disabled: true }),
      description: new FormControl({ value: null, disabled: true }),
      email: new FormControl({ value: null, disabled: true }, Validators.pattern(Utils.emailRegexp)),
      invoiceEmail: new FormControl({ value: null, disabled: true }, Validators.pattern(Utils.emailRegexp)),
      voucherEmail: new FormControl({ value: null, disabled: true }, Validators.pattern(Utils.emailRegexp)),
      phone: new FormControl({ value: null, disabled: true }, Validators.pattern(Utils.phoneRegexp)),
      fax: new FormControl({ value: null, disabled: true }),
      homePage: new FormControl({ value: null, disabled: true }),
      name: new FormControl({ value: null, disabled: true }),
      id: new FormControl({ value: null, disabled: true }),
      vatNumber: new FormControl({ value: null, disabled: true }),
      licenseNumber: new FormControl({ value: null, disabled: true }),
      registerNumber: new FormControl({ value: null, disabled: true }),
      logo: new FormControl(null),
      servicesActual: new FormControl(null),
      defaultPage: new FormControl(null),
      isSendInvoiceToUserAir: new FormControl(null),
      isSendInvoiceToUserHotel: new FormControl(null),
      isSendInvoiceToUserTrain: new FormControl(null),
      isSendInvoiceToUserTransfer: new FormControl(null),
      isBookNonRefundable: new FormControl({ value: null, disabled: true }),
      isBookingFeePercent: new FormControl({ value: null, disabled: true }),
      bookingFee: new FormControl({ value: null, disabled: true }),
      isPostPayment: new FormControl({ value: null, disabled: true }),
    });

    const type = this.vocabulary.notHorseTypes.find((item) => item.id === this.company.typeId);
    if (type) {
      this.form.get('invoiceEmail').setValidators(Validators.compose([Validators.required, Validators.pattern(Utils.emailRegexp)]));
      this.form.get('voucherEmail').setValidators(Validators.compose([Validators.required, Validators.pattern(Utils.emailRegexp)]));
    }
  }

  private _setCountryType(country: string): void {
    switch (country) {
      case CountryType.Ru:
        this.countryType = CountryType.Ru;
        break;
      case CountryType.Cn:
        this.countryType = CountryType.Cn;
        break;
      default:
        this.countryType = CountryType.Other;
    }
  }

  private _edit(): void {
    this.mode = ViewMode.Edit;
    this.emitMode.emit(this.mode);
    this._updateControlAccess();
    this._setToolbarActions();
    !(<ViewRef>this._cdr).destroyed && this._cdr.detectChanges();
  }

  private _cancel(): void {
    this.mode = ViewMode.View;
    this.emitMode.emit(this.mode);
    this.emitCompany.emit(this._originCompany);
    this.form.patchValue(this._originCompany);
    this._updateControlAccess();
    this._setToolbarActions();
  }

  private _setToolbarActions(): void {
    this._toolbarActions.actions$.next([
      {
        name: 'save',
        disabled: false,
        tooltipText: 'Save',
        icon: 'save',
        action: () => this.save(),
        visible: this.mode !== ViewMode.View,
      },
      {
        name: 'cancel',
        disabled: false,
        tooltipText: 'Cancel',
        icon: 'undo',
        action: () => this._cancel(),
        visible: this.mode !== ViewMode.View,
      },
      {
        name: 'edit',
        disabled: this.mode !== ViewMode.View,
        tooltipText: 'Edit',
        icon: 'edit',
        action: () => this._edit(),
        visible: this.isAdmin && this.mode !== ViewMode.Add,
      },
    ]);
    !(<ViewRef>this._cdr).destroyed && this._cdr.detectChanges();
  }

  private _markFormGroupTouched(formGroup: FormGroup): void {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      control.updateValueAndValidity();
      control.controls && this._markFormGroupTouched(control);
    });
  }

  private _updateControlAccess(): void {
    this.isEditable.forEach((control) => {
      this.form.get(control)[this.mode === ViewMode.View ? 'disable' : 'enable']();
    });
  }

}

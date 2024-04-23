import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewRef,
} from '@angular/core';
import { MatSlideToggleChange } from '@angular/material';
import { FormGroup, ValidatorFn, Validators } from '@angular/forms';

// external libs
import { BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// models
import { CompanyServiceType } from './company-service-type.model';

// enums
import { ViewMode } from '../../../../enums';
import { CompanyType } from '../../../h21-header/company-type.enum';

// interfaces
import { ICoreEnvironment } from '../../../../interfaces/core-environment.interface';
import { IServiceType } from './service-type.interface';
import { ICompany } from '../../interfaces/company.interface';

// services
import { ToolbarActionsService } from '../../../../services/toolbar-actions.service';
import { CompanySettingService } from '../../services/company-setting.service';
import { CompanyService } from '../../services/company.service';
import { ServiceTypeService } from './service-type.service';
import { Utils } from '../../../../services/utils';

// token
import { CORE_ENVIRONMENT } from '../../../h21-company-list/core-environment.token';

@Component({
  selector: 'h21-services',
  templateUrl: './services.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ServiceTypeService, CompanyService],
})
export class ServicesComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public form: FormGroup;
  @Input() public isAdmin: boolean;
  @Input() public company: ICompany;
  @Input() public mode: ViewMode;

  @Output() public emitMode: EventEmitter<ViewMode> = new EventEmitter<ViewMode>();
  @Output() public emitCompany: EventEmitter<ICompany> = new EventEmitter<ICompany>();

  public viewMode = ViewMode;

  public types$ = new BehaviorSubject<IServiceType[]>([]);
  public showAdditionalSettings: boolean;
  public isReadOnlyServices: boolean;

  private _originCompany: ICompany;
  private _allServiceTypes: IServiceType[];
  private _originalServicesActual: CompanyServiceType[];
  private _servicesActual: CompanyServiceType[];
  private _destroy$ = new Subject<boolean>();

  constructor(private _cdr: ChangeDetectorRef,
              private _service: ServiceTypeService,
              private _setting: CompanySettingService,
              private _companyService: CompanyService,
              private _toolbarActions: ToolbarActionsService,
              @Inject(CORE_ENVIRONMENT) public core: ICoreEnvironment,
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.mode && changes.mode.currentValue) {
      this.mode = changes.mode.currentValue;
    }
  }

  public ngOnInit() {
    this._setShowAdditionalSettings();
    setTimeout(() => { this._setToolbarActions(); }, 0);

    this._originCompany = Utils.deepCopy(this.company);
    this.isReadOnlyServices = this.company.readRules.isReadOnlyServices;

    this.types$.asObservable()
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this._cdr.detectChanges());

    this._refreshCompanyServiceTypes();
    this._updateControlAccess();
    this._updateBookingFeeValidators(this.company.readRules.isReadOnlyBookingFeePercent);
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public trackByFn(index: number): number {
    return index;
  }

  public change(event: MatSlideToggleChange, serviceType: IServiceType): void {
    serviceType.isDefault = event.checked;
    const serviceActual = this._servicesActual.find((f) => f.serviceTypeId === serviceType.id);

    if (event.checked && !serviceActual) {
      const service = new CompanyServiceType({
        companyProfileId: this.company.id,
        serviceTypeId: serviceType.id,
      });
      this._servicesActual.push(service);
    } else {
      this._servicesActual.splice(this._servicesActual.indexOf(serviceActual), 1);
    }
    this.form.get('servicesActual').setValue(this._servicesActual);
  }

  public save(): void {
    this.company.servicesActual = this._servicesActual;
    this.company.isPostPayment = this.form.get('isPostPayment').value;
    this.company.isBookNonRefundable = this.form.get('isBookNonRefundable').value;
    this.company.isBookingFeePercent = this.form.get('isBookingFeePercent').value;
    this.company.bookingFee = this.form.get('bookingFee').value;

    if (this.form.get('bookingFee').invalid) {
      this.form.get('bookingFee').enable();
      this.form.get('bookingFee').markAsTouched();
      this.form.get('bookingFee').updateValueAndValidity();

      return;
    }

    this.mode = ViewMode.View;
    this.emitMode.emit(this.mode);
    this._updateControlAccess();
    this._setToolbarActions();

    this._companyService.save(this.company)
      .pipe(takeUntil(this._destroy$))
      .subscribe((company) => {
        this._originCompany = Utils.deepCopy(company);
        this.company = Utils.deepCopy(company);
        this.emitCompany.emit(this.company);
        this._refreshCompanyServiceTypes();
      });
  }

  public onBookingFeeTypeChange(eventValue: boolean): void {
    this._updateBookingFeeValidators(eventValue);
    this.form.get('bookingFee').markAsTouched();
    this.form.get('bookingFee').updateValueAndValidity();
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
    this._updateControlAccess();
    this._setToolbarActions();
    this._setCompanyServiceTypes(this._originalServicesActual);
  }

  private _refreshCompanyServiceTypes(): void {
    const types$ = this._service.getTypes();
    const companyTypes$ = this._service.getCompanyTypes(this.company.id);

    forkJoin([types$, companyTypes$])
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (values) => {
          this._allServiceTypes = values[0];
          this._originalServicesActual = Utils.deepCopy(values[1]);
          this._servicesActual = Utils.deepCopy(values[1]);
          this._setCompanyServiceTypes(this._servicesActual);
        },
      });
  }

  private _setCompanyServiceTypes(servicesActual: CompanyServiceType[]): void {
    this._allServiceTypes.map((item) => {
      item.isDefault = !!servicesActual.find((value) => value.serviceTypeId === item.id);
    });
    this.types$.next(this._allServiceTypes);
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
  }

  private _updateControlAccess(): void {
    this.form.get('isPostPayment')[this._getActive(this.company.readRules.isReadOnlyPostPayment)]();
    this.form.get('isBookNonRefundable')[this._getActive(this.company.readRules.isReadOnlyBookNonRefundable)]();
    this.form.get('isBookingFeePercent')[this._getActive(this.company.readRules.isReadOnlyBookingFeePercent)]();
    this.form.get('bookingFee')[this._getActive(this.company.readRules.isReadOnlyBookingFee)]();
  }

  private _getActive(isReadOnly: boolean): string {
    return (this.mode === ViewMode.View || isReadOnly) ? 'disable' : 'enable';
  }

  private _updateBookingFeeValidators(isBookingFeePercent: boolean): void {
    this.form.get('bookingFee').clearValidators();
    this.form.get('bookingFee').setValidators(this._getBookingFeeValidators(isBookingFeePercent));
    this.form.get('bookingFee').updateValueAndValidity();
  }

  private _getBookingFeeValidators(isPercent: boolean): ValidatorFn[] {
    const amount = [Validators.required, Validators.min(0.01), Validators.pattern(/^\d*\.?\d{1,2}$/)];
    const percent = amount.concat([Validators.max(100)]);
    return isPercent ? percent : amount;
  }

  private _setShowAdditionalSettings(): void {
    const deniedTypes = [CompanyType.H21G, CompanyType.H21B, CompanyType.PROV];
    this.showAdditionalSettings = !deniedTypes.includes(this.company.typeId);
  }

}

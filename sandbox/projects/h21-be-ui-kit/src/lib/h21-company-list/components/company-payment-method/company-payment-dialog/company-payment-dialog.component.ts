import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// utils
import { H21StringUtils } from '../../../../../services/h21-string.utils';

// interfaces
import { IH21DialogPanel } from '../../../../h21-dialog-panel/h21-dialog-panel.interface';
import { ICompanyBankAccount } from '../../../interfaces/company-bank-account.interface';
import { INamedEntity } from '../../../../../interfaces/named-entity.interface';

// tokens
import { DIALOG_PANEL_DATA } from '../../../../h21-dialog-panel/h21-dialog-panel.tokens';

// models
import { PaymentMethodDialogData } from '../payment-method-dialog-data.model';

// services
import { CompanyService } from '../../../services/company.service';
import { ReferencesService } from '../../../../../services/references.service';

// animation
import { ToggleVisibilityAnimation } from '../../../../../animations/toggle-visibility';
import { ToggleSlideAnimation } from '../../../../../animations/toggle-slide';

// enums
import { PanelAction, PaymentTypeId, ViewMode } from '../../../../../enums';
import { ICodeNamedEntity } from '../../../../../interfaces';

@Component({
  selector: 'h21-company-payment-dialog',
  templateUrl: './company-payment-dialog.component.html',
  styleUrls: [ './company-payment-dialog.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    ToggleVisibilityAnimation,
    ToggleSlideAnimation,
  ],
})
export class CompanyPaymentDialogComponent implements OnInit, OnDestroy {

  public references$ = new BehaviorSubject<ICodeNamedEntity[]>(null);
  public substituteParameters$ = this._companyService.getSubstituteParameters();

  public animationState: 'void' | 'enter' | 'leave' = 'enter';
  public animationStateChanged = new EventEmitter<AnimationEvent>();

  public editable: boolean;
  public actionInProgress: boolean;

  public dialogData: PaymentMethodDialogData;
  public maxLength = PaymentTypeId.airPlus === this._dialogPanel.data.paymentTypeId ? 19 : 15;

  public form: FormGroup;
  public selectedRefIds: number[] = [];

  public stateList$: BehaviorSubject<INamedEntity[]> = new BehaviorSubject<INamedEntity[]>([]);
  public monthList$: Observable<number[]>;
  public yearList$: Observable<number[]>;
  public costModeList$: Observable<INamedEntity[]>;
  public entity: ICompanyBankAccount = {};

  private _index = 0;
  private _cardNumberPattern = '^[0-9]+$';
  private _destroy$ = new Subject<boolean>();

  constructor(private _cdr: ChangeDetectorRef,
              private _companyService: CompanyService,
              private _referenceService: ReferencesService,
              @Inject(DIALOG_PANEL_DATA) private _dialogPanel: IH21DialogPanel<PaymentMethodDialogData>,
  ) {
    this.dialogData = { ...this._dialogPanel.data };
    this.editable = this.dialogData.mode !== ViewMode.View;
    this._buildForm();
  }

  public ngOnInit() {
    this.monthList$ = of([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    this.yearList$ = of(this._getYears(2030));
    this.costModeList$ = this._referenceService.getPaySumTypes();

    const refs$ = this._companyService.getCardReferenceList(this._dialogPanel.data.paymentTypeId).pipe(takeUntil(this._destroy$));
    refs$.subscribe((refs) => this.references$.next(refs));

    switch (this.dialogData.mode) {
      case ViewMode.View:
      case ViewMode.Edit:
        this.actionInProgress = true;
        this._companyService.bankAccountGetEntity(this.dialogData.id)
          .pipe(takeUntil(this._destroy$))
          .subscribe((account: ICompanyBankAccount) =>  (!!account) && this._onViewOrEditForm(account));
        break;
      case ViewMode.Add:
          this.form.patchValue({ companyId: this.dialogData.companyId });
        break;
    }
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public onAnimation(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  public startExitAnimation(): void {
    this.animationState = 'leave';
  }

  public save(): void {
    if (this.form.invalid) {
      return;
    }

    this.actionInProgress = true;
    const additionalData = {
      paymentTypeId: this.dialogData.paymentTypeId,
      expiryDate: new Date(this.form.controls.expiryYear.value, this.form.controls.expiryMonth.value),
    };
    const payment: ICompanyBankAccount = { ...this.form.value, ...additionalData };
    this._companyService.bankAccountPostEntity(payment)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          this.actionInProgress = false;
          this._dialogPanel.data.action = PanelAction.SAVE;
          this._dialogPanel.data.overlay.detach();
        },
        error: () => {
          this.actionInProgress = false;
          this._cdr.detectChanges();
        },
      });
  }

  public close(): void {
    this._dialogPanel.data.action = PanelAction.CLOSE;
    this._dialogPanel.data.overlay.detach();
  }

  public trackByFn(index) {
    return index;
  }

  public trackByFnFg(index: number, fg: FormGroup): number {
    return fg.get('index').value;
  }

  public addReferenceFields(): void {
    this._filterReferences();

    const arr = <FormArray>this.form.controls.referencesActual;
    arr.push(new FormGroup({
      index: new FormControl(this._index++),
      companyPaymentMethodId: new FormControl(this.entity.id),
      cardReferenceId: new FormControl({ value: null, disabled: !this.editable }, [ Validators.required ]),
      name: new FormControl({ value: null, disabled: !this.editable }, [ Validators.required ]),
      value: new FormControl({ value: null, disabled: !this.editable }),
      substituteParameterId: new FormControl({ value: null, disabled: !this.editable }),
      isOptional: new FormControl({ value: false, disabled: !this.editable }),
    }));
  }

  public onReferenceChange(fg: FormGroup, id: number): void {
    const name = this.references$.value.find((ref) => ref.id === id).name;
    fg.get('name').setValue(name);
    this._filterReferences();
  }

  public onSubstituteParameterChange(fg: FormGroup, value: string): void {
    if (value) {
      fg.get('value').setValue('');
      fg.get('value').disable();
    } else {
      fg.get('value').markAsUntouched();
      fg.get('value').enable();
    }
  }

  public removeReferenceField(index: number): void {
    const i = (<FormArray>this.form.get('referencesActual')).controls.findIndex((fg: FormGroup) => fg.get('index').value === index);
    (i !== -1) && (<FormArray>this.form.controls.referencesActual).removeAt(i);
    this._filterReferences();
  }

  private _disableValueBySubstitute(): void {
    (<FormArray>this.form.get('referencesActual')).controls.forEach((fg: FormGroup) => {
      this.onSubstituteParameterChange(fg, fg.get('substituteParameterId').value);
    });
  }

  private _onViewOrEditForm(data: ICompanyBankAccount): void {
    this.entity = data;
    this._hideCardNumber(this.entity);
    const date = new Date(this.entity.expiryDate);
    this.entity.referencesActual.forEach(() => this.addReferenceFields());
    this.form.patchValue({ ...this.entity, ...{ expiryMonth: date.getMonth() + 1, expiryYear: date.getFullYear() } });
    this.editable && this._disableValueBySubstitute();
    this.actionInProgress = false;
  }

  private _hideCardNumber(data: ICompanyBankAccount): void {
    if (this.dialogData.mode === ViewMode.View) {
      data.cardNumber = H21StringUtils.getNumber(data.cardNumber, data.isHideCardDetail);
    }
  }

  private _getYears(lastYear: number = 2030, firstYear?: number): number[] {
    !firstYear && (firstYear = new Date().getFullYear());
    const yearList: number[] = [];
    for (let i = firstYear; i <= lastYear; i++) {
      yearList.push(i);
    }
    return yearList;
  }

  private _buildForm(): void {
    this.form = new FormGroup({
      id: new FormControl(),
      companyId: new FormControl(),
      isActive: new FormControl({ value: true, disabled: !this.editable }),
      isDefault: new FormControl({ value: false, disabled: !this.editable }),
      cardName: new FormControl({ value: null, disabled: !this.editable }, Validators.required),
      cardNumber: new FormControl({ value: null, disabled: !this.editable },
        [Validators.required, Validators.minLength(10), Validators.maxLength(this.maxLength), Validators.pattern(this._cardNumberPattern)]),
      expiryMonth: new FormControl({ value: null, disabled: !this.editable }, Validators.required),
      expiryYear: new FormControl({ value: null, disabled: !this.editable }, Validators.required),
      costModeId: new FormControl({ value: null, disabled: !this.editable }, Validators.required),
      isHideCardExpiryDate: new FormControl({ value: false, disabled: !this.editable }),
      isHideCardDetail: new FormControl({ value: true, disabled: !this.editable }),
      referencesActual: new FormArray([]),
    });
  }

  private _filterReferences(): void {
    this.selectedRefIds = (<FormArray>this.form.get('referencesActual')).controls.map((fg: FormGroup) => fg.get('cardReferenceId').value);
  }

}

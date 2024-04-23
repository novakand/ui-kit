import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { forkJoin, Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// utils
import { H21StringUtils } from '../../../../../services/h21-string.utils';

// interfaces
import { IH21DialogPanel } from '../../../../h21-dialog-panel/h21-dialog-panel.interface';
import { ICompanyBankAccount } from '../../../interfaces/company-bank-account.interface';
import { INamedEntity } from '../../../../../interfaces/named-entity.interface';
import { ICurrency } from '../../../../../interfaces/currency.interface';

// models
import { PaymentMethodDialogData } from '../payment-method-dialog-data.model';

// services
import { ReferencesService } from '../../../../../services/references.service';
import { CompanyService } from '../../../services/company.service';

// tokens
import { DIALOG_PANEL_DATA } from '../../../../h21-dialog-panel/h21-dialog-panel.tokens';

// enums
import { PanelAction } from '../../../../../enums/panel-action.enum';
import { ViewMode } from '../../../../../enums/view-mode.enum';
import { ReffernceStateMachine } from '../../../../../enums/refference-state-machine.enum';

// animation
import { ToggleSlideAnimation } from '../../../../../animations/toggle-slide';
import { ToggleYScaleAnimation } from '../../../../../animations/toggle-y-scale';

@Component({
  selector: 'h21-company-bank-account-edit',
  templateUrl: './company-bank-account-edit.component.html',
  animations: [
    ToggleSlideAnimation,
    ToggleYScaleAnimation,
  ],
})
export class CompanyBankAccountEditComponent implements OnInit, OnDestroy, AfterViewInit {

  public animationState: 'void' | 'enter' | 'leave' = 'enter';
  public animationStateChanged = new EventEmitter<AnimationEvent>();

  public editable: boolean;
  public actionInProgress: boolean;

  public dialogData: any;

  public form: FormGroup;

  public currencies: ICurrency[] = [];
  public entity: ICompanyBankAccount = {};

  public showErrorMessage: boolean;

  @ViewChild('container') private _container: ElementRef;

  private _swiftCodePattern: RegExp = /^([a-zA-Z\d]{8}|[a-zA-Z\d]{11})$/;
  private _bicPattern: RegExp = /^[a-zA-Z0-9]{0,20}$/;
  private _accountNumberPattern: RegExp = /^[\da-zA-Z]*$/;
  private _abaPattern: RegExp = /^\d{9}$/;
  private _sortCodePattern: RegExp = /^(?!(?:0{6}|00-00-00))(?:\d{6}|\d{2}-\d{2}-\d{2})$/;
  private _codeControls: string[] = ['recipientSortCode', 'recipientAbaCode', 'recipientBankSwift', 'recipientBic'];

  private _destroy$ = new Subject<boolean>();

  constructor(private _references: ReferencesService,
              private _companyService: CompanyService,
              @Inject(DIALOG_PANEL_DATA) private _dialogPanel: IH21DialogPanel<PaymentMethodDialogData>,
  ) {
    this.dialogData = { ..._dialogPanel.data };
    this.editable = this.dialogData.mode !== ViewMode.View;
    this._buildForm();

    if (!this.editable) {
      this.form.get('accountNumber').clearValidators();
      this.form.get('accountNumber').updateValueAndValidity();
    }
  }

  public ngOnInit(): void {
    const onFill: Observable<any>[] = [];

    switch (this.dialogData.mode) {
      case ViewMode.View:
      case ViewMode.Edit:
        this.actionInProgress = true;
        onFill.push(this._companyService.bankAccountGetEntity(this.dialogData.id));
        break;
      case ViewMode.Add:
        onFill.push(of(
          this.form.patchValue({
            companyId: this.dialogData.companyId,
          }),
        ));
        break;
    }

    onFill.push(this._references.getCurrencies());
    forkJoin(onFill)
      .subscribe({
        next: ([account, currencies]) => {
          account && this._onViewOrEditForm(account);
          this.currencies = currencies;
        },
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public ngAfterViewInit() {
    this._container.nativeElement.focus();
  }

  public onAnimation(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  public startExitAnimation(): void {
    this.animationState = 'leave';
  }

  public trackByFn(index) {
    return index;
  }

  public validateAndSave() {
    const accountNumber = this.form.get('accountNumber');
    this.showErrorMessage = this._checkCodes();

    if (this.showErrorMessage) {
      this._codeControls.forEach((control) => {
        this.form.get(control).setErrors({ pattern: true });
        this.form.get(control).markAsTouched();
      });
    } else {
      accountNumber.value ? this._searchByAccountNumber(accountNumber) : this.save();
    }
  }

  public save(): void {
    if (this.form.invalid) {
      Object.values(this.form.controls)
        .forEach((e) => {
          e.markAsTouched();
          e.updateValueAndValidity();
        });
      return;
    }

    this.actionInProgress = true;
    const payment: ICompanyBankAccount = { ...this.form.value, ...{ paymentTypeId: this.dialogData.paymentTypeId } };
    this._companyService.bankAccountPostEntity(payment)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          this.actionInProgress = false;
          this._dialogPanel.data.action = PanelAction.SAVE;
          this._dialogPanel.data.overlay.detach();
        },
        error: () => { this.actionInProgress = false; },
      });
  }

  public close(): void {
    this._dialogPanel.data.action = PanelAction.CLOSE;
    this._dialogPanel.data.overlay.detach();
  }

  private _onViewOrEditForm(data: ICompanyBankAccount): void {
    this.entity = data;
    this._hideAccountNumber(this.entity);
    this.form.patchValue(this.entity);
    this.actionInProgress = false;
  }

  private _hideAccountNumber(data: ICompanyBankAccount): void {
    if (this.dialogData.mode === ViewMode.View) {
      data.accountNumber = H21StringUtils.getNumber(data.accountNumber, data.isHideCardDetail);
    }
  }

  private _checkCodes(): boolean {
    const form = this.form.value;
    return !form.recipientBic && !form.recipientBankSwift && !form.recipientAbaCode && !form.recipientSortCode;
  }

  private _searchByAccountNumber(accountNumber: AbstractControl): void {
    this._companyService.searchByAccountNumber(this.dialogData.companyId, accountNumber.value)
      .pipe(takeUntil(this._destroy$))
      .subscribe((data) => {
        if ((!this.entity && data.count >= 1) || (data.count >= 1 && (data.items[0].id !== this.entity.id))) {
          accountNumber.setErrors({ incorrect: true });
          accountNumber.markAsTouched();
        } else {
          if (accountNumber.hasError('incorrect')) {
            accountNumber.setErrors(null);
          }
          this.save();
        }
      });
  }

  private _buildForm(): void {
    this.form = new FormGroup({
      companyId: new FormControl(),
      accountNumber: new FormControl({ value: null, disabled: !this.editable },
        [Validators.required, Validators.pattern(this._accountNumberPattern)]),
      recipientBankName: new FormControl({ value: null, disabled: !this.editable }, Validators.required),
      recipientBankSwift: new FormControl({ value: null, disabled: !this.editable }, Validators.pattern(this._swiftCodePattern)),
      recipientBic: new FormControl({ value: null, disabled: !this.editable }, Validators.pattern(this._bicPattern)),
      recipientAbaCode: new FormControl({ value: null, disabled: !this.editable }, Validators.pattern(this._abaPattern)),
      recipientSortCode: new FormControl({ value: null, disabled: !this.editable }, Validators.pattern(this._sortCodePattern)),
      recipientBankAddress: new FormControl({ value: null, disabled: !this.editable }),
      correspondentAccount: new FormControl({ value: null, disabled: !this.editable }),
      correspondentBankName: new FormControl({ value: null, disabled: !this.editable }),
      correspondentBankSwift: new FormControl({ value: null, disabled: !this.editable }, Validators.pattern(this._swiftCodePattern)),
      correspondentBic: new FormControl({ value: null, disabled: !this.editable }, Validators.pattern(this._bicPattern)),
      correspondentAbaCode: new FormControl({ value: null, disabled: !this.editable }, Validators.pattern(this._abaPattern)),
      correspondentSortCode: new FormControl({ value: null, disabled: !this.editable }, Validators.pattern(this._sortCodePattern)),
      accountCurrencyCurrencyCode: new FormControl({ value: null, disabled: !this.editable }, Validators.required),
      correspondentAccountCurrencyCurrencyCode: new FormControl({ value: null, disabled: !this.editable }),
      isActive: new FormControl({ value: true, disabled: !this.editable }, Validators.required),
      isDefault: new FormControl({ value: false, disabled: !this.editable }),
      isHideCardDetail: new FormControl({ value: true, disabled: !this.editable }),
      id: new FormControl(),
    });
  }

}

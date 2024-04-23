import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// interfaces
import { IH21DialogPanel } from '../../../../h21-dialog-panel';
import { ICompanyBankAccount } from '../../../interfaces';

// tokens
import { DIALOG_PANEL_DATA } from '../../../../h21-dialog-panel/h21-dialog-panel.tokens';

// services
import { CompanyService } from '../../../services/company.service';

// animation
import { ToggleVisibilityAnimation } from '../../../../../animations/toggle-visibility';
import { ToggleSlideAnimation } from '../../../../../animations/toggle-slide';

// enums
import { PanelAction, ReffernceStateMachine, ViewMode } from '../../../../../enums';

// models
import { PaymentMethodDialogData } from '../payment-method-dialog-data.model';

@Component({
  selector: 'h21-credit-card-dialog',
  templateUrl: './credit-card-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    ToggleVisibilityAnimation,
    ToggleSlideAnimation,
  ],
})
export class CreditCardDialogComponent implements OnInit, OnDestroy {

  public animationState: 'void' | 'enter' | 'leave' = 'enter';
  public animationStateChanged = new EventEmitter<AnimationEvent>();

  public editable: boolean;
  public actionInProgress: boolean;

  public form: FormGroup;
  public viewMode = ViewMode;
  public dialogData = this._dialogPanel.data;

  private _destroy$ = new Subject<boolean>();

  constructor(private _cdr: ChangeDetectorRef,
              private _companyService: CompanyService,
              @Inject(DIALOG_PANEL_DATA) private _dialogPanel: IH21DialogPanel<PaymentMethodDialogData>,
  ) {
    this.editable = this.dialogData.mode !== ViewMode.View;
    this._buildForm();
  }

  public ngOnInit() {
    this._load();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public trackByFn(index: number): number {
    return index;
  }

  public onAnimation(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  public startExitAnimation(): void {
    this.animationState = 'leave';
  }

  public close(): void {
    this._dialogPanel.data.action = PanelAction.SAVE;
    this._dialogPanel.data.overlay.detach();
  }

  public save(): void {
    this.actionInProgress = true;
    this._companyService.bankAccountPostEntity(this.form.value)
    .pipe(takeUntil(this._destroy$))
    .subscribe({
      next: () => {
        this.actionInProgress = false;
        this._cdr.detectChanges();
        this.close();
      },
    });
  }

  private _load(): void {
    switch (this.dialogData.mode) {
      case ViewMode.View:
      case ViewMode.Edit:
        this.actionInProgress = true;
        this._getBankAccount();
        break;
      case ViewMode.Add:
        this.form.patchValue({
          paymentTypeId: this.dialogData.paymentTypeId,
          companyId: this.dialogData.companyId,
          cardName: 'Credit card',
        });
        break;
    }
  }

  private _getBankAccount(): void {
    this._companyService.bankAccountGetEntity(this.dialogData.id)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (account: ICompanyBankAccount) => {
          this.form.patchValue(account);
          this.actionInProgress = false;
        },
      });
  }

  private _buildForm(): void {
    this.form = new FormGroup({
      companyId: new FormControl(),
      paymentTypeId: new FormControl(),
      isActive: new FormControl({ value: true, disabled: !this.editable }, Validators.required),
      isDefault: new FormControl({ value: false, disabled: !this.editable }, Validators.required),
      cardName: new FormControl({ value: null, disabled: !this.editable }),
      id: new FormControl(),
    });
  }

}

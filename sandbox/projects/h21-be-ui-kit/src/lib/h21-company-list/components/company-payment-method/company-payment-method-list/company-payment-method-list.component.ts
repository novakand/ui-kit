import { Component, Input, OnDestroy } from '@angular/core';

import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// services
import { CompanySettingService } from '../../../../h21-company-profile/services/company-setting.service';
import { H21DialogPanelService } from '../../../../h21-dialog-panel/h21-dialog-panel.service';
import { H21DefaultDialogService } from '../../../../dialogs/h21-default-dialog.service';
import { LoadProgressService } from '../../../../../services/load-progress.service';
import { CompanyService } from '../../../services/company.service';

// components
import { CompanyBankAccountEditComponent } from '../company-bank-account-edit/company-bank-account-edit.component';
import { CompanyPaymentDialogComponent } from '../company-payment-dialog/company-payment-dialog.component';
import { CreditCardDialogComponent } from '../company-credit-card-dialog/credit-card-dialog.component';

// interfaces
import { IH21DialogPanel } from '../../../../h21-dialog-panel/h21-dialog-panel.interface';
import { INamedEntity } from '../../../../../interfaces/named-entity.interface';

// models
import { PaymentMethodDialogData } from '../payment-method-dialog-data.model';
import { PaymentMethod } from '../../../models/payment-method.model';

// enums
import { ConfirmResult, PanelAction, ViewMode } from '../../../../../enums';
import { PaymentTypeId } from '../../../../../enums/payment-type-id.enum';
import { CompanyType } from '../../../../h21-header/company-type.enum';
import { PaymentType } from '../../../enums/payment-type.enum';

@Component({
  selector: 'h21-company-payment-list',
  templateUrl: './company-payment-method-list.component.html',
})
export class CompanyPaymentMethodListComponent implements OnDestroy {

  @Input()
  set id(value: number) {
    if (value === this._id) {
      return;
    }

    this._id = value;
    this.loadData();
  }
  get id(): number { return this._id; }

  @Input()
  set readonly(value: boolean) {
    if (value === this._readonly) {
      return;
    }

    this._readonly = value;
    this.setDisplayColumns();
  }
  get readonly() { return this._readonly; }

  @Input() public typeId: number;

  public paymentTypes: INamedEntity[] = [
    { id: PaymentTypeId.bta, name: PaymentType.bta },
    { id: PaymentTypeId.airPlus, name: PaymentType.airPlus },
  ];

  public isAdmin: boolean;
  public inProgress = true;
  public noProgress: boolean;

  public dataSource: PaymentMethod[] = [];
  public displayedColumns: string[];

  public mode = ViewMode;

  private _id: number;
  private _readonly: boolean;
  private _allPaymentTypes: INamedEntity[] = [
    { id: PaymentTypeId.bankTransfer, name: PaymentType.bankTransfer },
    { id: PaymentTypeId.airPlus, name: PaymentType.airPlus },
    { id: PaymentTypeId.bta, name: PaymentType.bta },
    { id: PaymentTypeId.dinersClub, name: PaymentType.dinersClub },
    { id: PaymentTypeId.creditCards, name: PaymentType.creditCards },
  ];

  private _destroy$ = new Subject<boolean>();

  constructor(private _companyService: CompanyService,
              private _setting: CompanySettingService,
              private _dialogs: H21DefaultDialogService,
              private _loadProgressService: LoadProgressService,
              private _dialogPanelService: H21DialogPanelService,
  ) {
    this.setDisplayColumns();
    this._setting.isAdmin()
    .pipe(takeUntil(this._destroy$))
    .subscribe({ next: (isAdmin) => this.isAdmin = isAdmin });
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public trackByFn(id: number): number {
    return id;
  }

  public loadData() {
    this._loadProgressService.show(1);
    this.noProgress = false;

    this._companyService.bankAccountPostQuery(this._id || -1)
      .pipe(
        map((result) => result.items
          .map((paymentMethod) => new PaymentMethod(paymentMethod)),
        ),
        takeUntil(this._destroy$))
      .subscribe({
        next: (items: PaymentMethod[]) => {
          this.dataSource = items;
          this._addCreditCards();
          this._addBankTransfers();
          this._loadProgressService.hide(1);
          this.inProgress = false;
          this.noProgress = !items || items.length === 0;
        },
      });
  }

  public setDisplayColumns() {
    this.displayedColumns = [
      'paymentMethod',
      'name',
      'number',
      'isActive',
      'isDefault',
      'actions',
    ];
  }

  public showPaymentDialog(paymentTypeId: PaymentTypeId, mode: ViewMode,  entityId?: number): void {
    this._readonly = !this.readonly;
    const panelData: IH21DialogPanel<PaymentMethodDialogData> = {
      data: new PaymentMethodDialogData({
        id: entityId,
        companyId: this._id,
        paymentTypeId: paymentTypeId,
        paymentTypeName: this._allPaymentTypes.find((type) => type.id === paymentTypeId).name,
        mode: mode,
      }),
    };

    panelData.data.overlay = this._dialogPanelService.open(
      this._getComponent(paymentTypeId, panelData),
      panelData,
    );

    panelData.data.overlay
      .detachments()
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this._readonly = !this.readonly;
        if (panelData.data.action === PanelAction.SAVE) {
          if (this.dataSource != null && this.dataSource.length === 0) {
            this.inProgress = true;
            this.noProgress = false;
          }
          this.loadData();
        }
      });
  }

  public remove(entity: PaymentMethod) {
    this._dialogs.confirm('Remove payment method', `Remove payment method ${entity.paymentMethod}. Are you sure?`)
      .afterClosed()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (result) => {
          if (result === ConfirmResult.Yes) {
            this._delete(entity.id);
          }
        },
      });
  }

  private _delete(id: number): void {
    this._companyService.bankAccountPostDelete({ id: id })
      .pipe(takeUntil(this._destroy$))
      .subscribe({ complete: () => { this.loadData(); }, });
  }

  private _getComponent(paymentType: PaymentTypeId, panelData: IH21DialogPanel<PaymentMethodDialogData>): any {
    switch (paymentType) {
      case PaymentTypeId.creditCards:
        return CreditCardDialogComponent;
      case PaymentTypeId.bankTransfer:
        panelData.data.stateId = 10;
        return CompanyBankAccountEditComponent;
      case PaymentTypeId.airPlus:
      case PaymentTypeId.bta:
        return CompanyPaymentDialogComponent;
    }
  }

  private _addCreditCards(): void {
    const isCardExist = this.dataSource.find((type) => type.paymentTypeId === PaymentTypeId.creditCards);
    if (isCardExist) {
      this.paymentTypes = this.paymentTypes.filter((type) => type.id !== PaymentTypeId.creditCards);
    } else {
      const cardTypes = [CompanyType.A, CompanyType.AB, CompanyType.CORP];

      const isExist = this.paymentTypes.find((type) => type.id === PaymentTypeId.creditCards);
      if (!isExist && cardTypes.includes(this.typeId)) {
        this.paymentTypes.push(
          {
            id: PaymentTypeId.creditCards,
            name: PaymentType.creditCards,
          });
      }
    }
  }

  private _addBankTransfers(): void {
    const bankTransferTypes = [
      CompanyType.H21B,
      CompanyType.H21G,
      CompanyType.H21B,
      CompanyType.A,
      CompanyType.AB,
      CompanyType.PROV,
    ];

    const isExist = this.paymentTypes.find((type) => type.id === PaymentTypeId.bankTransfer);
    if (!isExist && bankTransferTypes.includes(this.typeId)) {
      this.paymentTypes.unshift({
        id: PaymentTypeId.bankTransfer,
        name: PaymentType.bankTransfer,
      });
    }
  }

}

import { Component, Input, OnDestroy } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// services
import { CompanySettingService } from '../../../../h21-company-profile/services/company-setting.service';
import { CompanyAddressEditService } from '../company-address-edit/company-address-edit.service';
import { SysadminVocabularyService } from '../../../../../services/sysadmin-vocabulary.service';
import { H21DefaultDialogService } from '../../../../dialogs/h21-default-dialog.service';
import { LoadProgressService } from '../../../../../services/load-progress.service';
import { CompanyService } from '../../../services/company.service';

// interfaces
import { ICompanyAddress, ICompanyAddressList } from '../../../interfaces';

// enums
import { ConfirmResult } from '../../../../../enums';

// models
import { Query } from '../../../../../models';

@Component({
  selector: 'h21-company-address-list',
  templateUrl: './company-address-list.component.html',
})
export class CompanyAddressListComponent implements OnDestroy {

  @Input()
  set id(value: number) {
    if (value === this._id) {
      return;
    }

    this._id = value;
    this.loadData();
  }

  get id(): number {
    return this._id;
  }

  @Input()
  public readonly: boolean;

  public dataSource: ICompanyAddressList[] = [];
  public displayedColumns = [
    'typeId',
    'zip',
    'countryName',
    'cityName',
    'address',
    'actions',
  ];

  public isAdmin: boolean;
  public inProgress = true;
  public noProgress: boolean;

  private _id: number;

  private _destroy$ = new Subject<boolean>();

  constructor(private _setting: CompanySettingService,
              private _companyService: CompanyService,
              private _dialogs: H21DefaultDialogService,
              private _vocabulary: SysadminVocabularyService,
              private _loadProgressService: LoadProgressService,
              private _addressEditService: CompanyAddressEditService,
  ) {
    this._setting.isAdmin()
    .pipe(takeUntil(this._destroy$))
    .subscribe({ next: (isAdmin) => this.isAdmin = isAdmin });
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public loadData() {
    const filter = new Query({
      filter: {
        companyId: this._id || -1,
        entityStateIn: [1, 2, 3],
      },
      withCount: false,
    });

    this._loadProgressService.show(1);
    this.noProgress = false;

    this._companyService.addressPostQuery(filter)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (e) => {
          this.dataSource = this.afterLoadData(e.items);

          this._loadProgressService.hide(1);
          this.inProgress = false;
          this.noProgress = !e.items || e.items.length === 0;
        },
      });
  }

  public afterLoadData(items: ICompanyAddressList[]): ICompanyAddressList[] {
    return items.map((e: ICompanyAddressList) => {
      if (e.typeId) {
        e.typeName = this._vocabulary.nameById(this._vocabulary.companyAddressType, e.typeId);
      }

      return e;
    });
  }

  public showAddressDialog(entity?: ICompanyAddressList, isReadonly?: boolean) {
    const data: ICompanyAddress = entity ? { id: entity.id } : { companyId: this._id };
    data.devIsReadonly = isReadonly || this.readonly;

    const editRef = this._addressEditService.open(data);

    editRef
      .afterClosed
      .pipe(takeUntil(this._destroy$))
      .subscribe((companies) => {
        if (!!companies) {
          if (this.dataSource == null || this.dataSource.length === 0) {
            this.inProgress = true;
            this.noProgress = false;
          }
          this.loadData();
        }
      });
  }

  public remove(entity: ICompanyAddressList) {
    this._dialogs.confirm('Remove address', `Remove address ${entity.address}. Are you sure?`)
      .afterClosed()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (result) => {
          result === ConfirmResult.Yes && this._deleteAddress(entity.id);
        },
      });
  }

  private _deleteAddress(addressId: number): void {
    this._companyService.addressPostDelete({ id: addressId })
      .pipe(takeUntil(this._destroy$))
      .subscribe({ next: () => this.loadData() });
  }

}

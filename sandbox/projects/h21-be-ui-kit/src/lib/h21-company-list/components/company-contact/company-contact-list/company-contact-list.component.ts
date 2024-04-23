import { Component, Input, OnDestroy } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// services
import { CompanySettingService } from '../../../../h21-company-profile/services/company-setting.service';
import { CompanyContactEditService } from '../company-contact-edit/company-contact-edit.service';
import { H21DefaultDialogService } from '../../../../dialogs/h21-default-dialog.service';
import { LoadProgressService } from '../../../../../services/load-progress.service';
import { CompanyService } from '../../../services/company.service';

// interfaces
import { ICompanyContact } from '../../../interfaces';

@Component({
  selector: 'h21-company-contact-list',
  templateUrl: './company-contact-list.component.html',
})
export class CompanyContactListComponent implements OnDestroy {

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

  public isAdmin: boolean;
  public inProgress = true;
  public noProgress: boolean;

  public dataSource: ICompanyContact[] = [];
  public displayedColumns: string[];

  private _id: number;
  private _readonly: boolean;

  private _destroy$ = new Subject<boolean>();

  constructor(private _companyService: CompanyService,
              private _setting: CompanySettingService,
              private _dialogs: H21DefaultDialogService,
              private _loadProgressService: LoadProgressService,
              private _contactEditService: CompanyContactEditService,
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

  public loadData() {
    const query = {
      filter: {
        companyId: this._id || -1,
        entityStateIn: [1, 2, 3],
      },
      withCount: false,
    };

    this._loadProgressService.show(1);
    this.noProgress = false;

    this._companyService.contactPostQuery(query)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (e) => {
          this.dataSource = e.items;

          this._loadProgressService.hide(1);
          this.inProgress = false;
          this.noProgress = !e.items || e.items.length === 0;
        },
      });
  }

  public setDisplayColumns() {
    if (this._readonly) {
      this.displayedColumns = [
        'firstName',
        'lastName',
        'email',
        'phone',
        'position',
        'actions',
      ];
    } else {
      this.displayedColumns = [
        'firstName',
        'lastName',
        'email',
        'phone',
        'position',
        'actions',
      ];
    }
  }

  public showContactDialog(entity: ICompanyContact) {
    const contact = entity || {
      companyId: this.id,
    };

    const editRef = this._contactEditService.open(contact);

    editRef.afterClosed
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (data) => {
          if (!!data) {
            if (this.dataSource == null || this.dataSource.length === 0) {
              this.inProgress = true;
              this.noProgress = false;
            }
            this.loadData();
          }
        },
      });
  }

  public remove(entity: ICompanyContact) {
    this._dialogs.confirm('Remove contact', `Remove contact ${entity.firstName}. Are you sure?`)
      .afterClosed()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (result) => {
          if (result === 'yes') {
            this._delete(entity.id);
          }
        },
      });
  }

  private _delete(id: number): void {
    this._companyService.contactPostDelete({ id: id })
      .pipe(takeUntil(this._destroy$))
      .subscribe({ complete: () => { this.loadData(); } });
  }

}

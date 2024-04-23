import { Component, Input, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';

// enums
import { ConfirmResult, EntityState } from '../../../../../enums';

// services
import { CompanySettingService } from '../../../../h21-company-profile/services/company-setting.service';
import { H21DefaultDialogService } from '../../../../dialogs/h21-default-dialog.service';
import { CompanyNoteEditService } from '../company-note-edit/company-note-edit.service';
import { LoadProgressService } from '../../../../../services/load-progress.service';
import { SettingsService } from '../../../../../services/settings.service';
import { CompanyService } from '../../../services/company.service';

// interfaces
import { ICompanyNote } from '../../../interfaces';

@Component({
  selector: 'h21-company-note-list',
  templateUrl: './company-note-list.component.html',
})
export class CompanyNoteListComponent implements OnDestroy {

  @Input()
  set id(value: number) {
    if (value === this._id) { return; }

    this._id = value;
    this.loadData();
  }
  get id(): number { return this._id; }

  @Input()
  set readonly(value: boolean) {
    if (value === this._readonly) { return; }

    this._readonly = value;
  }
  get readonly() { return this._readonly; }

  public isAdmin: boolean;

  public dataSource: ICompanyNote[] = [];
  public displayedColumns = ['createUserName', 'note', 'actions'];

  public inProgress = true;
  public noProgress: boolean;

  private _id: number;
  private _readonly: boolean;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private _http: HttpClient,
              private _settings: SettingsService,
              private _setting: CompanySettingService,
              private _companyService: CompanyService,
              private _dialogs: H21DefaultDialogService,
              private _noteEditService: CompanyNoteEditService,
              private _loadProgressService: LoadProgressService,
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
    const queryDto = {
      filter: {
        companyId: this._id || -1,
        entityStateIn: [EntityState.ACTUAL, EntityState.ACTUAL_VERSION, EntityState.VERSION],
      },
      withCount: false,
    };

    this._loadProgressService.show(1);
    this.noProgress = false;

    this._companyService.notePostQuery(queryDto)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (data) => {
          const items = data.items;
          this._updateUserName(items);
          this.dataSource = items;

          this._loadProgressService.hide(1);
          this.inProgress = false;
          this.noProgress = !items || items.length === 0;
        },
      });
  }

  public showNoteDialog(entity: ICompanyNote, viewOnly?: boolean) {
    const note = entity ? { ...entity, viewOnly: viewOnly } : { companyId: this._id, viewOnly: viewOnly };

    const editRef = this._noteEditService.open(note);

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

  public remove(entity: ICompanyNote) {
    this._dialogs.confirm('Remove note', `Remove note ${entity.note}. Are you sure?`)
      .afterClosed()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (result) => {
          result === ConfirmResult.Yes && this._delete(entity.id);
        },
      });
  }

  private _delete(id: number): void {
    this._companyService.notePostDelete({ id: id })
      .pipe(takeUntil(this._destroy$))
      .subscribe({ next: () => { this.loadData(); } });
  }

  private _updateUserName(notes: ICompanyNote[]): void {
    const url = `${this._settings.environment.profileApi}UserProfile/`;

    const filtered = notes.filter((item) => item.createUserName);
    const requests = filtered.map((history) => {
      return this._http.get(`${ url }GetUserNameByEmail?email=${ history.createUserName }`, { responseType: 'text' });
    });

    const zip = (a, b) => a.map((x, i) => [x, b[i]]);

    forkJoin(requests)
      .subscribe({
        next: (values) => {
          for (const [a, b] of zip(filtered, values)) {
            a.createUserName = b;
          }
          this.dataSource = notes;
        },
      });

  }

}

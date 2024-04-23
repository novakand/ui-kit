import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewRef,
} from '@angular/core';
import { MatTableDataSource, PageEvent } from '@angular/material';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// animation
import { ToggleVisibilityAnimation } from '../../../../animations/toggle-visibility';

// interfaces
import { ICompanyUser } from '../../interfaces/company-user.interface';
import { IH21Column, IH21Order } from '../../../h21-table';
import { ICompany } from '../../interfaces';

// enums
import { ConfirmResult, ViewMode } from '../../../../enums';
import { RowAction } from '../../../h21-table/row-action.enum';

// services
import { H21DefaultDialogService } from '../../../dialogs/h21-default-dialog.service';
import { ToolbarActionsService } from '../../../../services/toolbar-actions.service';
import { LoadProgressService } from '../../../../services/load-progress.service';
import { IdentityUserProfileService } from './identity-user-profile.service';
import { CompanyUserService } from '../../services/company-user.service';

import { Utils } from '../../../../services/utils';

// models
import { Query } from '../../../../models/query.model';
import { UsersFilter } from './users-filter.model';

const ACTIONS = [RowAction.Confirm, RowAction.Delete];

const COLUMNS: IH21Column[] = [
  {
    caption: 'First name',
    name: 'userProfileFirstName',
    header: 'First name',
    required: true,
    default: true,
    displayed: true,
  },
  {
    caption: 'Last name',
    name: 'userProfileLastName',
    header: 'Last name',
    required: true,
    default: true,
    displayed: true,
  },
  { caption: 'Email', name: 'userProfileEmail', header: 'Email', required: false, default: true, displayed: true },
  { caption: 'Phone', name: 'userProfilePhone', header: 'Phone', required: false, default: true, displayed: true },
  { caption: 'Job title', name: 'jobTitle', header: 'Job title', required: false, default: true, displayed: true },
  { caption: 'Role', name: 'roleNames', header: 'Role', required: false, default: true, displayed: true },
  { caption: 'Action', name: 'action', header: '', required: false, default: true, displayed: true, controls: ACTIONS },
];

@Component({
  selector: 'h21-users',
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [ToggleVisibilityAnimation],
  providers: [
    IdentityUserProfileService,
  ],
})
export class UsersComponent implements OnInit, OnDestroy {

  @Input() public mode: ViewMode;
  @Input() public isAdmin: boolean;
  @Input() public companyId: number;
  @Input() public company: ICompany;

  @Output() public emitMode: EventEmitter<ViewMode> = new EventEmitter<ViewMode>();
  @Output() public emitCompany: EventEmitter<ICompany> = new EventEmitter<ICompany>();

  public inProgress: boolean;
  public showNoData: boolean;

  public pageSize = 10;
  public totalCount: number;

  public viewMode = ViewMode;

  public order: IH21Order = { field: 'createDate', desc: true };
  public columns: IH21Column[] = COLUMNS;
  public dataSource: MatTableDataSource<ICompanyUser>;

  @ViewChild('importFile') private _importFile: ElementRef;

  private _originCompany: ICompany;
  private _destroy$ = new Subject<boolean>();

  constructor(private _cdr: ChangeDetectorRef,
              private _service: CompanyUserService,
              private _defDialog: H21DefaultDialogService,
              private _toolbarActions: ToolbarActionsService,
              private _loadProgressService: LoadProgressService,
              private _identityService: IdentityUserProfileService,
  ) { }

  public ngOnInit(): void {
    setTimeout(() => { this._setToolbarActions(); }, 0);
    this._originCompany = Utils.deepCopy(this.company);
    this._search();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public trackByFn(index: number): number {
    return index;
  }

  public sort(name: string): void {
    this.order = Utils.sort(this.order, name);
    this._search();
  }

  public pageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this._search(event.pageIndex);
  }

  public onAction(action: RowAction, data: ICompanyUser): void {
    switch (action) {
      case RowAction.Delete:
        this._onDelete(data);
        break;
      case RowAction.Confirm:
        this._defDialog.confirm('Send confirmation', `Send confirmation e-mail to ${data.userProfileEmail}. Are you sure?`)
          .afterClosed()
          .pipe(takeUntil(this._destroy$))
          .subscribe((result) => ConfirmResult.Yes === result && this.confirmEmailOnIdentity(data));
        break;
    }
  }

  public confirmEmailOnIdentity(data: ICompanyUser): void {
    this._identityService.confirmEmailOnIdentity(data.userProfileEmail, data.companyProfileId)
      .pipe(takeUntil(this._destroy$))
      .subscribe();
  }

  public isVisible(action: RowAction, user: ICompanyUser): boolean {
    if (RowAction.Delete === action) {
      return this.isAdmin;
    }
    return RowAction.Confirm === action && (this.isAdmin && !user.userProfileIsEmailConfirmed);
  }

  public isActionCell(cellName: string): boolean {
    return cellName === 'action';
  }

  private _onDelete(user: ICompanyUser): void {
    this._defDialog.confirm('Delete', 'Delete user. Are you sure?')
      .afterClosed()
      .pipe(takeUntil(this._destroy$))
      .subscribe((result) => {
        if (ConfirmResult.Yes === result) {
          this._service.deleteUser(user)
            .subscribe({ next: () => { this._search(); } });
        }
      });
  }

  private _search(pageIndex?: number): void {

    const filter = new Query<UsersFilter>({
      withCount: true,
      take: this.pageSize,
      skip: this.pageSize * (pageIndex || 0),
      order: this.order ? [this.order] : null,
      filter: new UsersFilter({
        companyProfileId: this.companyId,
      }),
    });

    this.inProgress = true;
    this._loadProgressService.show(1);
    this._service.getList(filter)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (response) => {
          this.totalCount = response.count;
          this.showNoData = !this.totalCount;

          if (this.dataSource) {
            this.dataSource.connect().next(response.items);
          } else {
            this.dataSource = new MatTableDataSource<ICompanyUser>(response.items);
          }
          this.inProgress = false;
          this._loadProgressService.hide(1);
          this._cgahgeCdr();
        },
      });
  }

  private _edit(): void {
    this.mode = ViewMode.Edit;
    this.emitMode.emit(this.mode);
    this._setToolbarActions();
    this._cgahgeCdr();
  }

  private _cancel(): void {
    this.mode = ViewMode.View;
    this.emitMode.emit(this.mode);
    this.emitCompany.emit(this._originCompany);
    this._setToolbarActions();
    this._cgahgeCdr();
  }

  private _setToolbarActions(): void {

    const actions = [
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
    ];

    this._toolbarActions.actions$.next(actions);
  }

  private _cgahgeCdr(): void {
    !(<ViewRef>this._cdr).destroyed && this._cdr.detectChanges();
  }

}

import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewRef,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material';
import { DatePipe } from '@angular/common';

// libs
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// services
import { H21DialogPanelService } from '../../../h21-dialog-panel/h21-dialog-panel.service';
import { H21DefaultDialogService } from '../../../dialogs/h21-default-dialog.service';
import { ToolbarActionsService } from '../../../../services/toolbar-actions.service';
import { LoadProgressService } from '../../../../services/load-progress.service';
import { SettingsService } from '../../../../services/settings.service';
import { DepartmentService } from '../../services/department.service';
import { Utils } from '../../../../services/utils';

// components
import { DepartmentComponent } from './department/department.component';

// models
import { DepartmentPanelData } from './models/department-panel-data';
import { DepartmentFilter } from './models/department-filter.model';
import { Query } from '../../../../models/query.model';

// enums
import { ConfirmResult } from '../../../../enums/confirm-result.enum';
import { PanelAction } from '../../../../enums/panel-action.enum';
import { RowAction } from '../../../h21-table/row-action.enum';
import { ViewMode } from '../../../../enums/view-mode.enum';

// animation
import { ToggleVisibilityAnimation } from '../../../../animations/toggle-visibility';

// interfaces
import { IH21DialogPanel } from '../../../h21-dialog-panel/h21-dialog-panel.interface';
import { IH21Column, IH21Order } from '../../../h21-table/h21-column.interfaces';
import { IRowAction } from '../../../h21-table/row-action.interface';
import { IDepartment } from './interfaces/department.interface';
import { ICompany } from '../../interfaces';

@Component({
  selector: 'h21-departments',
  templateUrl: './departments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [ToggleVisibilityAnimation],
})
export class DepartmentsComponent implements OnInit, OnDestroy, OnChanges {

  @Input() public typeId: number;
  @Input() public mode: ViewMode;
  @Input() public isAdmin: boolean;
  @Input() public company: ICompany;
  @Input() public companyId: number;

  @Output() public emitMode: EventEmitter<ViewMode> = new EventEmitter<ViewMode>();
  @Output() public emitCompany: EventEmitter<ICompany> = new EventEmitter<ICompany>();

  public inProgress: boolean;
  public showNoData: boolean;

  public pageSize = 10;
  public totalCount: number;
  public viewMode = ViewMode;

  public order: IH21Order;
  public columns$: Observable<IH21Column[]>;
  public dataSource: IDepartment[];

  @ViewChild(MatPaginator) private _paginator: MatPaginator;

  private _originCompany: ICompany;
  private _destroy$ = new Subject<boolean>();

  constructor(private _http: HttpClient,
              private datePipe: DatePipe,
              private _cdr: ChangeDetectorRef,
              private _settings: SettingsService,
              private _service: DepartmentService,
              private _dialog: H21DialogPanelService,
              private _defDialog: H21DefaultDialogService,
              private _toolbarActions: ToolbarActionsService,
              private _loadProgressService: LoadProgressService,
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.mode && changes.mode.currentValue) {
      this.mode = changes.mode.currentValue;
    }
  }

  public ngOnInit(): void {
    setTimeout(() => { this._setToolbarActions(); }, 0);
    this._originCompany = Utils.deepCopy(this.company);
    this._search();
    this.columns$ = of(this._getColumns());
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public onRowAction(event: IRowAction<IDepartment>): void {
    switch (event.action) {
      case RowAction.Delete:
        this._delete(event.data);
        break;
      case RowAction.Edit:
        this.openCardForm(ViewMode.Edit, event.data.id);
        break;
      case RowAction.View:
        this.openCardForm(ViewMode.View, event.data.id);
        break;
    }
  }

  public sort(name: string): void {
    this.order = Utils.sort(this.order, name);
    this._search();
  }

  public pageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this._search(event.pageIndex);
  }

  public openCardForm(mode: ViewMode, id?: number): void {
    const panelData: IH21DialogPanel<DepartmentPanelData> = {
      data: new DepartmentPanelData({
        id: id,
        mode: mode,
        companyId: this.companyId,
        typeId: this.typeId,
      }),
    };

    panelData.data.overlay = this._dialog.open(DepartmentComponent, panelData);

    panelData.data.overlay
      .detachments()
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        panelData.data.action === PanelAction.SAVE && this._search();
      });
  }

  private _delete(department: IDepartment): void {
    this._defDialog.confirm('Delete', 'Are you sure you want to remove the department?')
      .afterClosed()
      .pipe(takeUntil(this._destroy$))
      .subscribe((result) => {
        if (ConfirmResult.Yes === result) {
          this._service.deleteDepartment(department)
            .pipe(takeUntil(this._destroy$))
            .subscribe({ next: () => this._search() });
        }
      });
  }

  private _search(pageIndex?: number): void {

    const filter = new Query<DepartmentFilter>({
      withCount: true,
      take: this.pageSize,
      skip: this.pageSize * (pageIndex || 0),
      order: this.order ? [this.order] : null,
      filter: new DepartmentFilter({
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
          response.items = response.items.map((v) => {
            v.createDate = this.datePipe.transform(v.createDate, 'MM.dd.yyyy HH:mm');
            return v;
          });
          this._setDS(response.items);
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
    this._toolbarActions.actions$.next([
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

  private _getColumns(): IH21Column[] {
    return [
      { caption: 'name', name: 'name', header: 'Department', required: true, default: true, displayed: true },
      { caption: 'createUserName', name: 'createUserName', header: 'Created by', required: true, default: true, displayed: true },
      { caption: 'createDate', name: 'createDate', header: 'Date and time of creation', required: true, default: true, displayed: true },
      {
        caption: 'Action',
        name: 'action',
        header: '',
        required: false,
        default: true,
        displayed: true,
        controls: !this.isAdmin ? [ RowAction.View ] : [ RowAction.View, RowAction.Edit, RowAction.Delete ],
      },
    ];
  }

  private _setDS(items: IDepartment[]): void {
    this.dataSource = items;
    this.showNoData = !this.totalCount;

    if (!this.totalCount) {
      this.inProgress = false;
      this._loadProgressService.hide(1);
    } else {
      this._updateUserName(items);
    }
    this._cgahgeCdr();
  }

  private _updateUserName(departments: IDepartment[]): void {
    const url = `${this._settings.environment.profileApi}UserProfile/`;

    const filtered = departments.filter((item) => item.createUserName);
    const requests = filtered.map((department) => {
      return this._http.get(`${ url }GetUserNameByEmail?email=${ department.createUserName }`, { responseType: 'text' });
    });

    const zip = (a, b) => a.map((x, i) => [x, b[i]]);

    forkJoin(requests)
    .subscribe({
      next: (values) => {
        for (const [a, b] of zip(filtered, values)) {
          a.createUserName = b;
        }
        this.dataSource = departments;
        this._loadProgressService.hide(1);
        this.inProgress = false;
        this._cgahgeCdr();
      },
    });
  }

  private _cgahgeCdr(): void {
    !(<ViewRef>this._cdr).destroyed && this._cdr.detectChanges();
  }

}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import { Router } from '@angular/router';

// external libs
import { filter, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

// animation
import { CompanyListAnimation } from '../../../../animations/company-list';

// enums
import { Application } from '../../../../enums/application.enum';

// interfaces
import { IColumn, ICoreEnvironment, IOrder } from '../../../../interfaces';
import { ICompanyProfileList } from '../../interfaces';

// services
import { CompanySettingService } from '../../../h21-company-profile/services/company-setting.service';
import { H21ColumnsSelectService } from '../../../h21-columns-select/h21-columns-select.service';
import { ToolbarActionsService } from '../../../../services/toolbar-actions.service';
import { LoadProgressService } from '../../../../services/load-progress.service';
import { CompanyFilterService } from '../company-filter/company-filter.service';
import { CompanyService } from '../../services/company.service';
import { Utils } from '../../../../services/utils';
import { CompanyListStorageService } from '../../storage.service';

// tokens & refs
import { CompanyFilterRef } from '../company-filter/company-filter-ref';
import { H21ColumnsSelectRef } from '../../../h21-columns-select';

// models
import { CompanyFilter } from '../company-filter/company-filter.model';
import { Query } from '../../../../models';
import { COLUMNS, CompanyListPageState } from '../../models';

// token
import { CORE_ENVIRONMENT } from '../../core-environment.token';

@Component({
  selector: 'h21-company-list',
  templateUrl: './company-list.component.html',
  animations: CompanyListAnimation,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyListComponent implements OnInit, OnDestroy {

  public isAdmin: boolean;
  public noProgress: boolean;
  public loadInProgress = true;

  public pageSize: number;
  public pageIndex: number;
  public totalCount: number;
  public columns: IColumn[];
  public displayedColumns: string[] = [];

  public filter: CompanyFilter;

  public order: IOrder;
  public dataSource: MatTableDataSource<ICompanyProfileList>;

  private filterDialogRef: CompanyFilterRef;

  private _defaultOrder: IOrder = { ...this.order };
  private columnsSelectDialogRef: H21ColumnsSelectRef;

  private _destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild(MatPaginator) private _paginator: MatPaginator;

  constructor(
    private _router: Router,
    private _cdr: ChangeDetectorRef,
    private _service: CompanyService,
    private _setting: CompanySettingService,
    private _filterDialog: CompanyFilterService,
    private _loadProgressService: LoadProgressService,
    private _columnsSelectDialog: H21ColumnsSelectService,
    private _toolbarActionsService: ToolbarActionsService,
    @Inject(CORE_ENVIRONMENT) private _core: ICoreEnvironment,
    private _storage: CompanyListStorageService,
  ) {
    this._setColumns();
  }

  public ngOnInit(): void {
    this._getPageState();
    this._checkAdmin();
    this._isAgentOffice() && (this.columns = this._getNoStateColumns());
    this.search();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public trackByFn(index: number): number {
    return index;
  }

  public setDisplayedColumns(): void {
    this.displayedColumns = [];
    this.columns.forEach(({ displayed, name }) => displayed && this.displayedColumns.push(name));
  }

  public pageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.search();
  }

  public search() {
    this._setApp();
    const query = new Query<CompanyFilter>({
      withCount: true,
      take: this.pageSize,
      skip: this.pageSize * this.pageIndex,
      filter: this.filter,
      order: this.order ? [this.order] : [this._defaultOrder],
    });

    this._loadProgressService.show(1);
    this.noProgress = false;

    const pageState = new CompanyListPageState(this.filter, this.pageIndex, this.pageSize, this.order);
    this._storage.companyPageState.next(pageState);

    this._service.companyPostQuery(query).pipe(takeUntil(this._destroy$))
      .subscribe((data) => {
        this.totalCount = data.count;
        const items = this._setRegNum(data.items);

        if (this.dataSource) {
          this.dataSource.connect().next(items);
        } else {
          this.dataSource = new MatTableDataSource<ICompanyProfileList>(items);
          this.dataSource.paginator = this._paginator;
        }

        this.loadInProgress = false;
        this._loadProgressService.hide(1);
        this.noProgress = this.totalCount === 0;

        this._cdr.detectChanges();
      });
  }

  public setToolbarActions(): void {
    this._toolbarActionsService.actions$.next([
      {
        name: 'filter',
        disabled: false,
        tooltipText: 'Open filter',
        icon: 'filter_list',
        cssClass: (this.checkFilter() ? 'h21-header-toolbar_action-button__is-marked' : ''),
        action: () => this.openFilter(),
        visible: true,
      },
      {
        name: 'setDisplayedColumns',
        disabled: false,
        tooltipText: 'Select displayed columns',
        icon: 'view_week',
        action: () => this.openColumnsSelect(),
        visible: true,
      },
    ]);
  }

  public openFilter(): void {
    this.filterDialogRef = this._filterDialog.open(this.filter);
    this.filterDialogRef.afterClosed.pipe(takeUntil(this._destroy$))
      .subscribe((data) => {
        if (data) {
          if (this._paginator) {
            this._paginator.firstPage();
          } else {
            this.loadInProgress = true;
            this.noProgress = false;
          }
          data.stateIdIn = data.stateIdIn && !data.stateIdIn.length ? null : data.stateIdIn;
          data.typeIdIn = data.typeIdIn && !data.typeIdIn.length ? null : data.typeIdIn;
          this.filter = data;
          this.search();
          this.setToolbarActions();
        }
      });
  }

  public openColumnsSelect(): void {
    this.columnsSelectDialogRef = this._columnsSelectDialog.open(this.columns);
    this.columnsSelectDialogRef.afterClosed$
      .pipe(
        filter(Boolean),
        tap((columns) => localStorage.setItem('CompanyColumns', JSON.stringify(columns))),
        takeUntil(this._destroy$),
      )
      .subscribe((data) => {
        this.columns = data;
        this.setDisplayedColumns();
      });
  }

  public openCard(id: string): void {
    !String(window.getSelection()).length && this._router.navigate(['companies/company/', id]);
  }

  public createCompany(): void {
    this._router.navigate(['companies/company/', 0]);
  }

  public checkFilter(): boolean {
    return !!Object.keys(this.filter).find((value) => {
      return value !== 'application' && !!this.filter[value];
    });
  }

  public sort(name: string) {
    this.order = Utils.sort(this.order, name);
    this.search();
  }

  public getActualContractStateName(hasActualContract: boolean): string {
    const state = this._service.getHasCompanyActualContractName(hasActualContract);
    return state && state.name;
  }

  public getCompanyTypeCssClassName(typeName: string): string {
    return typeName ? `h21-chip__company-${typeName.replace(' ', '-').toLowerCase()}` : '';
  }

  private _setRegNum(list: ICompanyProfileList[]): ICompanyProfileList[] {
    return list.map((i: ICompanyProfileList) => {
      i.regNum = i.registerNumber || i.inn || i.licenseNumber;
      return i;
    });
  }

  private _setApp(): void {
    const app = this._service.core.application;
    if (app === Application.AGENT_OFFICE) {
      this.filter.application = Application.AGENT_OFFICE;
    }
  }

  private _isAgentOffice(): boolean {
    return this._core.application === Application.AGENT_OFFICE;
  }

  private _getNoStateColumns(): IColumn[] {
    return this.columns.filter((v) => v.caption !== 'State');
  }

  private _getPageState(): void {
    this.pageIndex = this._storage.companyPageState.getValue().pageIndex;
    this.pageSize = this._storage.companyPageState.getValue().pageSize;
    this.filter = this._storage.companyPageState.getValue().companyFilter;
    this.order = this._storage.companyPageState.getValue().order;
  }

  private _checkAdmin(): void {
    this._setting.isAdmin().pipe(takeUntil(this._destroy$))
      .subscribe((isAdmin) => {
        this.isAdmin = isAdmin;
        this.setToolbarActions();
        this._cdr.detectChanges();
      });
  }

  private _setColumns(): void {
    const stored = localStorage.getItem('CompanyColumns');
    this.columns = (stored && JSON.parse(stored)) ? JSON.parse(stored) : COLUMNS;
    this.setDisplayedColumns();
  }

}

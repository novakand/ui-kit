import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter,
  Input,
  OnDestroy,
  OnInit, Output,
  ViewRef
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

// external libraries
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// services
import { H21DialogPanelService } from '../../../../h21-dialog-panel/h21-dialog-panel.service';
import { IH21DialogPanel } from '../../../../h21-dialog-panel/h21-dialog-panel.interface';
import { ToolbarActionsService } from '../../../../../services/toolbar-actions.service';
import { LoadProgressService } from '../../../../../services/load-progress.service';
import { CompanyService } from '../../../services/company.service';

// components
import { CompanyReferenceDialogComponent } from '../company-reference-dialog/company-reference-dialog.component';

// enums
import { PanelAction } from '../../../../../enums/panel-action.enum';
import { ViewMode } from '../../../../../enums/view-mode.enum';

// models
import { CompanyReferenceDialogData } from '../models/company-reference-dialog-data.model';
import { UpdateReferences } from '../models/references.models';
import { Query } from '../../../../../models/query.model';

// interfaces
import { IReferencesFilter } from '../interfaces/references.filter.interface';
import { IReferencesList } from '../interfaces/references.list.interface';

// constants
import { columns } from '../constants/columns.const';

@Component({
  selector: 'h21-company-references-list',
  templateUrl: './company-references-list.component.html',
  styleUrls: [ './company-references-list.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyReferencesListComponent implements OnInit, OnDestroy {

  @Input() public mode: ViewMode;
  @Input() public isAdmin: boolean;
  @Input() public companyProfileId: number;

  @Output() public emitMode: EventEmitter<ViewMode> = new EventEmitter<ViewMode>();

  public viewMode = ViewMode;

  public dataSource: IReferencesList[] = [];
  public displayedColumns = columns;
  public total: number;
  public pageSize = 10;
  public pageIndex = 0;

  public inProgress = true;
  public noProgress: boolean;
  public updatingMandatory: boolean;
  public updatingEnable: boolean;
  public rowId: number;

  private _destroy$ = new Subject<boolean>();

  constructor(
    private _cdr: ChangeDetectorRef,
    private _service: CompanyService,
    private _toolbarActions: ToolbarActionsService,
    private _loadProgressService: LoadProgressService,
    private _dialogPanelService: H21DialogPanelService,
  ) { }

  public ngOnInit(): void {
    setTimeout(() => { this._setToolbarActions(); }, 0);
    this._getCompanyReferences();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public trackByFn = (index: number): number => index;

  public updateItem(id: number, field: string, checked: boolean, path: string): void {
    this.setEditData(id, field, true);

    this._service.updateReference(new UpdateReferences(checked, id), path)
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.setEditData(null, field, false));
  }

  public setEditData(id: number, field: string, state: boolean): void {
    this[field] = state;
    this.rowId = id;
    this._cdr.detectChanges();
  }

  public openReferenceDialog(referenceId?: number): void {
    const panelData: IH21DialogPanel<CompanyReferenceDialogData> = {
      data: new CompanyReferenceDialogData({
        referenceId: referenceId || null,
        mode: referenceId ? ViewMode.Edit : ViewMode.Add,
        companyProfileId: this.companyProfileId,
      }),
    };

    panelData.data.overlay = this._dialogPanelService.open(CompanyReferenceDialogComponent, panelData);

    const detached$ = panelData.data.overlay.detachments()
      .pipe(
        filter(() => panelData.data.action === PanelAction.SAVE),
        takeUntil(this._destroy$),
      );
    detached$.subscribe(() => {
      this.inProgress = true;
      this._getCompanyReferences();
    });
  }

  public pageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this._getCompanyReferences();
  }

  private _getCompanyReferences(): void {
    this._loadProgressService.show(1);
    this.noProgress = false;
    this._cdr.detectChanges();

    const query = new Query<IReferencesFilter>({
      filter: { companyProfileId: this.companyProfileId },
      take: this.pageSize,
      skip: this.pageSize * this.pageIndex,
      withCount: true,
    });

    this._service.getCompanyReferences(query)
      .pipe(takeUntil(this._destroy$))
      .subscribe((data) => {
        this.dataSource = data.items;
        this.total = data.count;

        this._loadProgressService.hide(1);
        this.inProgress = false;
        this.noProgress = !data || data.items.length === 0;

        this._cdr.detectChanges();
      });
  }

  private _edit(): void {
    this.mode = ViewMode.Edit;
    this.emitMode.emit(this.mode);
    this._setToolbarActions();
    this._safeDetectChanges();
  }

  private _cancel(): void {
    this.mode = ViewMode.View;
    this.emitMode.emit(this.mode);
    this._setToolbarActions();
    this._safeDetectChanges();
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

  private _safeDetectChanges(): void {
    !(<ViewRef>this._cdr).destroyed && this._cdr.detectChanges();
  }

}

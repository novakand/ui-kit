import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter,
  Input,
  OnDestroy,
  OnInit, Output,
  ViewRef
} from '@angular/core';

// external libs
import { filter, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

// services
import { H21DialogPanelService } from '../../../../h21-dialog-panel/h21-dialog-panel.service';
import { IH21DialogPanel } from '../../../../h21-dialog-panel/h21-dialog-panel.interface';
import { ToolbarActionsService } from '../../../../../services/toolbar-actions.service';
import { LoadProgressService } from '../../../../../services/load-progress.service';
import { ProfileProviderService } from '../services/profile-provider.service';

// enums
import { PanelAction } from '../../../../../enums/panel-action.enum';
import { ViewMode } from '../../../../../enums/view-mode.enum';

// components
import { SuppliersDialogComponent } from '../suppliers-dialog/suppliers-dialog.component';

// interfaces
import { IProfileProvider } from '../interfaces';

// models
import { ProfileProviderFilter } from '../models';
import { Query } from '../../../../../models';

@Component({
  selector: 'h21-suppliers-list',
  templateUrl: './suppliers-list.component.html',
  styleUrls: [ './suppliers-list.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ ProfileProviderService ],
})
export class SuppliersListComponent implements OnInit, OnDestroy {

  @Input() public mode: ViewMode;
  @Input() public isAdmin: boolean;
  @Input() public companyProfileId: number;

  @Output() public emitMode: EventEmitter<ViewMode> = new EventEmitter<ViewMode>();

  public viewMode = ViewMode;

  public dataSource: IProfileProvider[];
  public pending = true;
  public loaderCount = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ];

  private _destroy$ = new Subject<boolean>();

  constructor(
    private _cdr: ChangeDetectorRef,
    private _service: ProfileProviderService,
    private _toolbarActions: ToolbarActionsService,
    private _loadProgressService: LoadProgressService,
    private _dialogPanelService: H21DialogPanelService,
  ) { }

  public ngOnInit(): void {
    setTimeout(() => { this._setToolbarActions(); }, 0);
    this.loadData();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public trackByFn(index: number): number {
    return index;
  }

  public onToggleChange(item: IProfileProvider, state: boolean): void {
    const state$ = this._service.updateEnable(item.id, state).pipe(takeUntil(this._destroy$));
    state$.subscribe(() => item.isEnable = state);
  }

  public loadData() {
    this._loadProgressService.show(1);
    this.pending = true;

    const data$ = this._service.getByFilter(this._buildFilter()).pipe(takeUntil(this._destroy$));
    data$.subscribe((data: IProfileProvider[]) => {
      this.dataSource = data;
      this.pending = false;
      this._loadProgressService.hide(1);
      this._cdr.detectChanges();
    });
  }

  public openSuppliersDialog(): void {
    const panelData: IH21DialogPanel = { data: { companyProfileId: this.companyProfileId } };
    panelData.data.overlay = this._dialogPanelService.open(SuppliersDialogComponent, panelData);

    const detached$ = panelData.data.overlay.detachments()
      .pipe(
        filter(() => panelData.data.action === PanelAction.SAVE),
        tap(() => this.pending = !(this.dataSource || this.dataSource.length)),
        takeUntil(this._destroy$),
      );
    detached$.subscribe(() => this.loadData());
  }

  private _buildFilter(): Query<ProfileProviderFilter> {
    return new Query<ProfileProviderFilter>({
      filter: new ProfileProviderFilter({
        companyProfileId: this.companyProfileId,
      }),
      withCount: false,
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

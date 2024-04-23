import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// interfaces
import { IProfileLink, IQueryResult } from '../../../../interfaces';
import { IH21DialogPanel } from '../../../h21-dialog-panel';

// models
import { ProfileLinkFilter, Query } from '../../../../models';
import { HierarchyPanelData } from '../../models';

// services
import { H21DialogPanelService } from '../../../h21-dialog-panel/h21-dialog-panel.service';
import { ToolbarActionsService } from '../../../../services/toolbar-actions.service';
import { LoadProgressService } from '../../../../services/load-progress.service';
import { ProfileLinkService } from '../../../../services/profile-link.service';

// components
import { HierarchyFilterComponent } from '../hierarchy-filter';

@Component({
  selector: 'h21-hierarchy',
  templateUrl: './hierarchy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HierarchyComponent implements OnInit, OnDestroy {

  public inProgress = true;
  public noProgress: boolean;

  public hierarchyList: IQueryResult<IProfileLink>;
  public filter: ProfileLinkFilter = new ProfileLinkFilter();
  public resetExpand: boolean;

  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private _router: Router,
              private _cdr: ChangeDetectorRef,
              private _service: ProfileLinkService,
              private _dialog: H21DialogPanelService,
              private _loadProgressService: LoadProgressService,
              private _toolbarActionsService: ToolbarActionsService,
  ) {
    this.filter.parentIdIsNull = true;
    this._toolbarActionsService.actions$.next([]);
  }

  public ngOnInit() {
    setTimeout(() => this._setToolbarActions(), 0);
    this._getList();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public trackByFn(index: number): number {
    return index;
  }

  public openFilter(): void {
    const panelData: IH21DialogPanel<HierarchyPanelData> = {
      data: new HierarchyPanelData({ filter: this.filter }),
    };

    panelData.data.overlay = this._dialog.open(HierarchyFilterComponent, panelData);

    panelData.data.overlay
      .detachments()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          if (panelData.data.action !== 0) {
            this.filter = panelData.data.filter;
            this.filter.parentIdIsNull = true;
            this.resetExpand = true;
            this._cdr.detectChanges();
            this._getList();
            this._setToolbarActions();
          }
        },
      });
  }

  private _checkFilter(): boolean {
    let result = false;
    Object.keys(this.filter).forEach((v) => (!!this.filter[v] && v !== 'parentIdIsNull') && (result = true));

    return result;
  }

  private _getList(): void {
    const filter = new Query<ProfileLinkFilter>({
      withCount: true,
      take: 20,
      skip: 0,
      filter: this.filter,
    });

    this._loadProgressService.show(1);

    this._service.getList(filter)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (data) => {
          this.hierarchyList = data.items;
          this.resetExpand = false;
          this.noProgress = !data.items || !data.items.length;
          this._cdr.detectChanges();
        },
        complete: () => {
          this.inProgress = false;
          this._loadProgressService.hide(1);
          this._cdr.detectChanges();
        },
      });
  }

  private _setToolbarActions(): void {
    this._toolbarActionsService.actions$.next([
      {
        name: 'filter',
        disabled: false,
        tooltipText: 'Open filter',
        icon: 'filter_list',
        cssClass: this._checkFilter()
          ? 'h21-header-toolbar_action-button__is-marked'
          : '',
        action: () => this.openFilter(),
        visible: true,
      },
    ]);
  }

}

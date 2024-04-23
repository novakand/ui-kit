import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewRef } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// animation
import { ToggleVisibilityAnimation } from '../../../../animations/toggle-visibility';

// interfaces
import { IProfileLink } from '../../../../interfaces/profile-link.interface';
import { IQueryResult } from '../../../../interfaces/query-result.interface';

// models
import { ProfileLinkFilter } from '../../../../models/profile-link-filter.model';
import { Query } from '../../../../models/query.model';

// services
import { ToolbarActionsService } from '../../../../services/toolbar-actions.service';
import { LoadProgressService } from '../../../../services/load-progress.service';
import { ProfileLinkService } from '../../../../services/profile-link.service';

@Component({
  selector: 'h21-hierarchy-company',
  templateUrl: './hierarchy-company.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [ToggleVisibilityAnimation],
})
export class HierarchyCompanyComponent implements OnInit, OnDestroy {

  @Input() public profileId: number;
  @Input() public typeId: number;

  public inProgress = true;
  public hierarchyList: IQueryResult<IProfileLink>;

  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private _service: ProfileLinkService,
              private _cdr: ChangeDetectorRef,
              private _loadProgressService: LoadProgressService,
              private _toolbarActionsService: ToolbarActionsService,
  ) { }

  public ngOnInit() {
    setTimeout(() => this._toolbarActionsService.actions$.next([]), 0);
    this._loadProgressService.show(1);
    this._getList();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  private _getList(): void {
    const filter = new Query<ProfileLinkFilter>({
      withCount: true,
      take: 20,
      skip: 0,
      filter: new ProfileLinkFilter({
        profileId: this.profileId,
        typeId: this.typeId,
      }),
    });
    this._service.getList(filter)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (data) => this.hierarchyList = data.items,
        complete: () => {
          this.inProgress = false;
          this._loadProgressService.hide(1);
          !(<ViewRef>this._cdr).destroyed && this._cdr.detectChanges();
        },
      });
  }

}

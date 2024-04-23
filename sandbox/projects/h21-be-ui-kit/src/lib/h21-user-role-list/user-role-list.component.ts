import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';

// external libs
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// components
import { LinksDialogComponent } from '../h21-links-dialog/links-dialog.component';

// services
import { H21DialogPanelService } from '../h21-dialog-panel/h21-dialog-panel.service';
import { LoadProgressService } from '../../services/load-progress.service';
import { UserRoleService } from './user-role.service';
import { UserProfileService } from '../../services/user-profile.service';

// interfaces
import { IH21DialogPanel } from '../h21-dialog-panel/h21-dialog-panel.interface';
import { IUserRoleList } from './user-role-list.interface';

// models
import { RolesDialogData } from './roles-dialog-data.model';
import { UserProfile } from '../../models/user-profile.model';

@Component({
  selector: 'h21-user-role-list',
  templateUrl: './user-role-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UserRoleService],
})
export class UserRoleListComponent implements OnInit, OnDestroy, OnChanges {

  @Input() public readonly: boolean;
  @Input() public id: number;

  public editable: boolean;
  public dataSource: IUserRoleList[] = [];
  public displayedColumns = [ 'companyName', 'regNumber', 'jobTitle', 'roleNames', 'actions' ];

  public loadInProgress = true;
  public noProgress: boolean;

  private _destroy$ = new Subject<boolean>();

  constructor(private _cdr: ChangeDetectorRef,
              private _userProfileService: UserProfileService,
              private _userRoleService: UserRoleService,
              private _loadProgressService: LoadProgressService,
              private _dialogPanelService: H21DialogPanelService,
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    changes.readonly && (this.editable = !changes.readonly.currentValue);
    this._cdr.detectChanges();
  }

  public ngOnInit(): void {
    this._loadData();
    this._cdr.detectChanges();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public showRoleDialog(linkId?: number, companyProfileId?: number): void {
    this._userProfileService.getUserById(this.id)
      .pipe(takeUntil(this._destroy$))
      .subscribe((userProfile: UserProfile) => {
      const panelData: IH21DialogPanel = {
        data: new RolesDialogData(
          {
            userProfile: userProfile,
            userProfileId: this.id,
            userProfileLinkId: linkId,
            companyProfileId: companyProfileId,
          },
        ),
      };
      this._openDialog(panelData);
    });
  }

  private _openDialog(panelData: IH21DialogPanel) {
    panelData.data.overlay = this._dialogPanelService.open(LinksDialogComponent, panelData);
    panelData.data.overlay.detachments()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          if (this.dataSource == null || this.dataSource.length === 0) {
            this.loadInProgress = true;
            this.noProgress = false;
            this._cdr.detectChanges();
          }

          this._loadData();
        },
      });
  }

  private _loadData(): void {
    this._loadProgressService.show(1);
    this.noProgress = false;

    this._userRoleService.getUserRoleList(this.id)
      .pipe(
        map((data) => data.items),
        takeUntil(this._destroy$),
      )
      .subscribe({
        next: (response) => {
          this.dataSource = response;

          this.loadInProgress = false;
          this.noProgress = response.length === 0;
          this._loadProgressService.hide(1);
          this._cdr.detectChanges();
        },
      });
  }

}

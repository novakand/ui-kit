import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// animation
import { ToggleMatExpansionAnimation } from '../../../../animations/toggle-mat-expansion';

// services
import { CompanySettingService } from '../../../h21-company-profile/services/company-setting.service';
import { SysadminVocabularyService } from '../../../../services/sysadmin-vocabulary.service';
import { CompanyService } from '../../../h21-company-profile/services/company.service';
import { ToolbarActionsService } from '../../../../services/toolbar-actions.service';
import { LoadProgressService } from '../../../../services/load-progress.service';

// tokens
import { CORE_ENVIRONMENT } from '../../../h21-company-list/core-environment.token';

// interfaces
import { IHistoryResponse } from '../../../h21-company-profile/interfaces/history-response.interface';
import { ICoreEnvironment } from '../../../../interfaces/core-environment.interface';
import { ICompany } from '../../../h21-company-profile/interfaces/company.interface';

// enums
import { AnimationState } from '../../../../enums/animation-state';
import { Application } from '../../../../enums/application.enum';
import { ViewMode } from '../../../../enums/view-mode.enum';

// models
import { ProfileName } from '../../../h21-company-profile/company-profile-setting.model';
import { Utils } from '../../../../services/utils';

// enum
import { CompanyType } from '../../../h21-header/company-type.enum';

// components
import { GeneralInfoComponent } from '../../../h21-company-profile/components/general-info/general-info.component';

@Component({
  selector: 'h21-details',
  templateUrl: './details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [ ToggleMatExpansionAnimation ],
  providers: [ CompanySettingService, CompanyService ],
})
export class DetailsComponent implements OnDestroy {

  @ViewChild('generalInfo') set generalInfo(cmp: GeneralInfoComponent) {
    cmp && (this._generalInfo = cmp);
  }

  get generalInfo(): GeneralInfoComponent {
    return this._generalInfo;
  }

  get tooltip(): string {
    return this.animationState === AnimationState.COLLAPSED ? 'Expand card header' : 'Collapse card header';
  }

  public viewMode = ViewMode;
  public inProgress: boolean;
  public mode = ViewMode.View;
  public isBackOfficeApp = this._core.application === Application.BACK_OFFICE;

  public isAdmin = true;
  public historyResponse: IHistoryResponse;

  public animationStateType = AnimationState;
  public animationState = AnimationState.EXPANDED;

  public validate: boolean;
  public profile: ProfileName;
  public originCompany: ICompany;
  public company$: Observable<ICompany>;

  public selectedIndex = 0;
  public selectedTab = 'General info';

  public isEditable: string[] = [];

  private _generalInfo: GeneralInfoComponent;
  private _destroy$ = new Subject<boolean>();

  constructor(private _route: ActivatedRoute,
              private _cdr: ChangeDetectorRef,
              private _service: CompanyService,
              private _setting: CompanySettingService,
              private _toolbarActions: ToolbarActionsService,
              private _vocabulary: SysadminVocabularyService,
              private _settingService: CompanySettingService,
              private _loadProgressService: LoadProgressService,
              @Inject(CORE_ENVIRONMENT) private _core: ICoreEnvironment,
  ) {
    setTimeout(() => this._toolbarActions.actions$.next([]), 0);

    this._getCompany();
    this._setting.isAdmin()
      .pipe(takeUntil(this._destroy$))
      .subscribe({ next: (isAdmin) => {
          this.isAdmin = isAdmin;
          this._cdr.detectChanges();
        },
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public toggleCardHeaderVisibility(): void {
    this.animationState =
      this.animationState === AnimationState.EXPANDED
        ? AnimationState.COLLAPSED
        : AnimationState.EXPANDED;
  }

  public updateMode(mode: ViewMode): void {
    this.mode = mode;
  }

  public getRegisterNumber(company: ICompany): string {
    if (company.countryCode === 'RU') {
      return company.inn;
    }

    if (company.countryCode === 'CN') {
      return company.licenseNumber;
    }
    return company.registerNumber;
  }

  public tabChange(tab: MatTabChangeEvent): void {
    this.selectedIndex = tab.index;
    this.selectedTab = tab.tab.textLabel;
    this.validate = this.selectedIndex === 0;
    (tab.tab.textLabel === 'Hierarchy' || tab.tab.textLabel === 'History') && (this._toolbarActions.actions$.next([]));
  }

  public companyType(id: number): string {
    return this._vocabulary.fieldById(this._vocabulary.companyType, id, 'name');
  }

  public loadedData(data: IHistoryResponse): void {
    this.historyResponse = data;
  }

  public updateCompany(company: ICompany): void {
    this.company$ = of(company);
    this.originCompany = Utils.deepCopy(company);
    this._generalInfo.form.invalid && (this.selectedIndex = 0);
  }

  public getCompanyTypeCssClassName(typeId: number): string {
    return typeId
      ? `h21-chip__company-${this.companyType(typeId).replace(' ', '-').toLowerCase()}`
      : '';
  }

  private _getCompany(): void {
    this.inProgress = true;
    const id = +this._route.snapshot.queryParams.id;
    this.company$ = this._service.getCompany(id);
    this.company$
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (company) => {
          this.originCompany = company;
          this.inProgress = false;
          this._loadProgressService.hide(1);
          this._cdr.detectChanges();
        },
      });
  }

}

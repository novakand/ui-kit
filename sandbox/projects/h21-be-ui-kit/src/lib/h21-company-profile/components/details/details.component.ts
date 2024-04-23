import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, ViewChild, ViewRef } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';

import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// animation
import { ToggleMatExpansionAnimation } from '../../../../animations/toggle-mat-expansion';

// services
import { SysadminVocabularyService } from '../../../../services/sysadmin-vocabulary.service';
import { ToolbarActionsService } from '../../../../services/toolbar-actions.service';
import { LoadProgressService } from '../../../../services/load-progress.service';
import { CompanySettingService } from '../../services/company-setting.service';
import { CompanyService } from './../../services/company.service';
import { Utils } from '../../../../services/utils';

// tokens
import { CORE_ENVIRONMENT } from '../../../h21-company-list/core-environment.token';

// interfaces
import { ICoreEnvironment } from '../../../../interfaces/core-environment.interface';
import { IHistoryResponse } from './../../interfaces/history-response.interface';
import { ICompany } from './../../interfaces/company.interface';
import { IFileInfo } from '../../../../interfaces';

// enums
import { AnimationState } from '../../../../enums/animation-state';
import { ViewMode } from '../../../../enums/view-mode.enum';
import { CountryType } from '../../../../enums/country-type.enum';

// models
import { CompanyProfileSetting, ProfileName } from '../../company-profile-setting.model';

// components
import { GeneralInfoComponent } from '../general-info/general-info.component';

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
  public validate: boolean;
  public mode: ViewMode = ViewMode.View;

  public isAdmin = true;
  public historyResponse: IHistoryResponse;

  public animationStateType = AnimationState;
  public animationState = AnimationState.EXPANDED;

  public profile: ProfileName;

  public selectedIndex = 0;
  public selectedTab = 'General info';

  public originCompany: ICompany;
  public company$: Observable<ICompany>;

  private _destroy$ = new Subject<boolean>();

  private _generalInfo: GeneralInfoComponent;

  constructor(private _cdr: ChangeDetectorRef,
              private _service: CompanyService,
              private _setting: CompanySettingService,
              private _toolbarActions: ToolbarActionsService,
              private _vocabulary: SysadminVocabularyService,
              private _settingService: CompanySettingService,
              private _loadProgressService: LoadProgressService,
              @Inject(CORE_ENVIRONMENT) private _core: ICoreEnvironment,
  ) {
    setTimeout(() => this._toolbarActions.actions$.next([]), 0);

    this._getSetting();
    this._setting.isAdmin()
      .pipe(takeUntil(this._destroy$))
      .subscribe({ next: (isAdmin) => {
          this.isAdmin = isAdmin;
          !(<ViewRef>this._cdr).destroyed && this._cdr.detectChanges();
        },
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public updateCompany(company: ICompany): void {
    this.company$ = of(company);
    this.originCompany = Utils.deepCopy(company);
    this._generalInfo.form.invalid && (this.selectedIndex = 0);
  }

  public toggleCardHeaderVisibility(): void {
    this.animationState =
      this.animationState === AnimationState.EXPANDED
        ? AnimationState.COLLAPSED
        : AnimationState.EXPANDED;
  }

  public getRegisterNumber(company: ICompany): string {
    if (company.countryCode === CountryType.Ru) {
      return company.inn;
    }

    if (company.countryCode === CountryType.Cn) {
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

  public setMode(mode: ViewMode): void {
    this.mode = mode;
  }

  public getCompanyTypeCssClassName(typeId: number): string {
    return typeId
      ? `h21-chip__company-${this.companyType(typeId).replace(' ', '-').toLowerCase()}`
      : '';
  }

  public save(): void {
    this._generalInfo.save();
  }

  public showSaveButton(): boolean {
    return this.mode !== ViewMode.View && this.selectedTab === 'General info';
  }

  public setLogo(logo: IFileInfo, company: ICompany): void {
    company.logo = logo;
    this._generalInfo.form.patchValue(company);
  }

  private _getSetting(): void {
    this._settingService.getSetting()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (setting) => {
          this.inProgress = true;
          this._loadProgressService.show(1);
          this._getCompany(setting);
        },
      });
  }

  private _getCompany(setting: CompanyProfileSetting): void {
    const id = setting.getCompanyProfileId(this._core.application);
    this.company$ = this._service.getCompany(id);
    this.company$
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (company) => {
          this.inProgress = false;
          this.originCompany = Utils.deepCopy(company);
          this._loadProgressService.hide(1);
          !(<ViewRef>this._cdr).destroyed && this._cdr.detectChanges();
        },
      });
  }

}

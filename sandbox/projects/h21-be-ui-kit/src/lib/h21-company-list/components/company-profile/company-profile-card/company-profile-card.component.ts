import { Component, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material/typings/select';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators } from '@angular/forms';
// lib
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
// animation
import { CompanyProfileCardAnimation } from '../../../../../animations/company-profile-card';
// enums
import { AnimationState, Application, CountryType, EntityState, ProfileCardMode } from '../../../../../enums';
import { Patterns } from './patterns.enum';
// interfaces
import { ICodeNamedEntity, ICoreEnvironment, ICountry } from '../../../../../interfaces';
import { LoadProgressService } from '../../../../../services/load-progress.service';
import { ReferencesService } from '../../../../../services/references.service';
import { ICompanyProfile } from '../../../interfaces';
// services
import { CompanyProfileCardFormValidatorService } from '../../../services/company-profile-card-form-validator.service';
import { CompanySettingService } from '../../../../h21-company-profile/services/company-setting.service';
import { SysadminVocabularyService } from '../../../../../services/sysadmin-vocabulary.service';
import { ToolbarActionsService } from '../../../../../services/toolbar-actions.service';
import { UtilsService } from '../../../../../services/utils.service';
import { CompanyService } from '../../../services/company.service';
// tokens
import { CORE_ENVIRONMENT } from '../../../core-environment.token';
// models
import { CompanyVersion } from '../../../models';
// components
import { CompanyVersionComponent } from '../company-version/company-version.component';
// builders
import { CompanyProfileToolbarBuilder } from './company-profile-toolbar.builder';
// builders
import { CompanyProfileFormBuilder } from './user-card-form.builder';

@Component({
  selector: 'h21-company-profile-card',
  templateUrl: './company-profile-card.component.html',
  animations: CompanyProfileCardAnimation,
})
export class CompanyProfileCardComponent implements OnInit, OnDestroy {

  @Input() public mode: ProfileCardMode;
  @Input() public entity: ICompanyProfile = {};

  @ViewChild(CompanyVersionComponent) public companyVersion: CompanyVersionComponent;

  public isAdmin: boolean;
  public selectedTab = 0;
  public isParentAvailable: boolean;

  public application = Application;

  public id: number;
  public entityId: number;

  public originalEntity: ICompanyProfile = {};
  public animationState = AnimationState.UP;
  public loadInProgress = true;
  public actionInProgress = true;
  public editable: boolean;
  public entityForm: FormGroup;
  public countries: ICountry[] = [];

  public selectedVersion: CompanyVersion;
  public companyTypes: ICodeNamedEntity[];
  public companyStates: ICodeNamedEntity[];

  public companies$: Observable<ICompanyProfile[]>;

  private _disableCompanyType: boolean;
  private _destroy$ = new Subject<boolean>();
  private _clearIfChanged: boolean;

  constructor(private _router: Router,
              public utils: UtilsService,
              private activatedRoute: ActivatedRoute,
              private _references: ReferencesService,
              private _setting: CompanySettingService,
              private _companyService: CompanyService,
              private _formValidationService: CompanyProfileCardFormValidatorService,
              public vocabulary: SysadminVocabularyService,
              private _loadProgressService: LoadProgressService,
              private toolbarActionsService: ToolbarActionsService,
              @Inject(CORE_ENVIRONMENT) public core: ICoreEnvironment,
  ) {
    this._setting.isAdmin()
    .pipe(takeUntil(this._destroy$))
    .subscribe({
      next: (isAdmin) => {
        this.isAdmin = isAdmin;
        this.setToolbarActions();
      },
    });
    this.companyStates = this.vocabulary.companyStates;
  }

  public ngOnInit(): void {
    this._setCountryList();
    this._loadProgressService.show(1);

    this.activatedRoute.params
      .pipe(takeUntil(this._destroy$))
      .subscribe((params) => {
        this.id = +params.id;

        this._companyService.companyGetEntity(this.id)
          .pipe(takeUntil(this._destroy$))
          .subscribe({
            next: (entity) => {
              this.entity = entity;
              this.entityId = entity.entityId;
              this.isParentAvailable = [1, 2].includes(entity.typeId);
              this.companies$ = this._companyService.getParentCompanies(this.entity.id);
              this.id === 0 && (this.entity.isAgentOffice = Application.AGENT_OFFICE === this.core.application);
              this.init();
              this.actionInProgress = false;
              this.loadInProgress = false;
              this._loadProgressService.hide(1);
            },
        });
    });
  }

  public setCurrentTab(index: number): void {
    this.selectedTab = index;
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public trackByFn(index: number): number { return index; }

  public init(): void {
    this.originalEntity = { ...this.entity };
    this.mode = this._getViewMode();
    this.companyTypes = this._getCompanyTypes();
    this.editable = !this.id;

    this.entityToForm();
    this.entityForm.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this._destroy$),
      )
      .subscribe(() => setTimeout(() => this.setToolbarActions(), 0));
  }

  public onChangeVersion(version: CompanyVersion) {
    this._router.navigate(['/companies/company/', version.companyId || this.id]);
    this.selectedVersion = version;
  }

  public onCheckOneVersion(oneVersion = false): void {
    this._disableCompanyType = !oneVersion;
    this.toggleSelectDisabled();
  }

  public compareCompanies(first: ICompanyProfile, second: ICompanyProfile): boolean {
    return (first && second) && first.id === second.id;
  }

  public entityToForm(): void {
    this.entityForm = CompanyProfileFormBuilder.build(this.entity, this.editable);
    const app = this.core.application;

    (app === Application.AGENT_OFFICE && this.isOtherCountry()) && this.setValidation('registerNumber', Patterns.registerNumber);

    if (this.isOtherCountry() && (app === Application.ADMIN_OFFICE || app === Application.BACK_OFFICE)) {
      this.setValidation('vatNumber', Patterns.vatNumber);
    }

    this._clearIfChanged = false;
    this._updateValidation();
    setTimeout(() => this.toggleSelectDisabled(), 0);
  }

  public setValidation(fieldName: string, pattern: string): void {
    const field = this.entityForm.get(fieldName);
    field.setValidators([Validators.required, Validators.pattern(new RegExp(pattern))]);
    field.updateValueAndValidity();
  }

  public toggleSelectDisabled(): void {
    if (this.entity.versionNumber > 1) {
      this.entityForm.get('typeId').disable();
    } else {
      this.entityForm.get('typeId')[this.editable && !this._disableCompanyType ? 'enable' : 'disable']();
    }
    this.entityForm.get('countryCode')[this.editable ? 'enable' : 'disable']();
    this.entityForm.get('parent')[this.editable ? 'enable' : 'disable']();
  }

  public formToEntity() {
    Object.keys(this.entityForm.controls).forEach((key) => {
      this.entity[key] = this.entityForm.controls[key].value;
    });
  }

  public changeEditable(value: boolean): void {
    if (this.editable !== value) {
      this.editable = value;
      this.toggleSelectDisabled();
      this.setToolbarActions();
    }
  }

  public getRegisterNumber(): string {
    if (this.isRussia()) {
      return this.entity.inn;
    }
    if (this.isChina()) {
      return this.entity.licenseNumber;
    }
    return this.entity.registerNumber;
  }

  public setReferences(): void {
    this._setCountryList();
  }

  public setViewMode(): void {
    this.mode = ProfileCardMode.view;
    this.changeEditable(false);
    this.companyTypes = this._getCompanyTypes();
  }

  public setEditMode(): void {
    this.mode = ProfileCardMode.edit;
    this.changeEditable(true);
    this.setReferences();
    this.companyTypes = this._getCompanyTypes();
  }

  public cancel(): void {
    if (this.mode === ProfileCardMode.add) {
      this._router.navigateByUrl('/companies');
    } else {
      this.entity = { ...this.originalEntity };
      this.entityToForm();
      this.setViewMode();
      this.entityForm.markAsUntouched();
    }
  }

  public save(): void {
    if (this.actionInProgress) {
      return;
    }

    if (this.entityForm.invalid) {
      Object.values(this.entityForm.controls).forEach((e) => e.markAsTouched());
      this.selectedTab = 0;
      return;
    }

    this.actionInProgress = true;
    this._loadProgressService.show(1);

    this.formToEntity();
    this._companyService.companyPostEntity(this.entity)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (entity) => {
          this.entityId = entity.entityId;
          if (!this.id) {
            this.id = entity.id;
            this._router.navigate([ '/companies/company/', this.id ]);
          } else {
            this.entity = entity;
            this.init();
          }
          this.actionInProgress = false;
          this._loadProgressService.hide(1);
        },
        error: () => {
          this.actionInProgress = false;
          this._loadProgressService.hide(1);
        },
      });
  }

  public publish(): void {
    if (this.actionInProgress) {
      return;
    }
    this.actionInProgress = true;
    this._loadProgressService.show(1);

    this._companyService.companyPublish(this.entity)
      .pipe(takeUntil(this._destroy$))
      .subscribe((entity) => {
        this.companyVersion && this.companyVersion.companyPublished$.next();
        this.entity = entity;
        this.init();
        this.actionInProgress = false;
        this._loadProgressService.hide(1);
      },
      () => {
        this.actionInProgress = false;
        this._loadProgressService.hide(1);
      },
    );
  }

  public typeChanged(event: MatSelectChange): void {
    this.isParentAvailable = [1, 2].includes(event.value);
    this.entityForm.get('parent')[this.editable ? 'enable' : 'disable']();
  }

  public countryChanged() {
    const country = this.entityForm.controls.countryCode;
    if (!country.value) {
      country.setValue(null);
      this.countries.length = 0;
    } else {
      this._references.getCountries()
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (e) => {
            this.countries = e.sort((n1, n2) => (n1.name > n2.name ? 1 : -1));
            const countryIndex = this.countries.findIndex((item) => country.value === item.code);

            if (!country || countryIndex === -1) {
              country.setValue(null);
              country.markAsUntouched();
            }
          },
      });
    }
    this.entity.countryCode = this.entityForm.controls.countryCode.value;
    this._clearIfChanged = true;
    this._updateValidation();
  }

  public setToolbarActions(): void {
    this.toolbarActionsService.actions$.next(CompanyProfileToolbarBuilder.build(this));
  }

  public toggleCardHeaderVisibility(): void {
    this.animationState = this.animationState === AnimationState.UP ? AnimationState.DOWN : AnimationState.UP;
  }

  public getHasActualCompanyValue(): string {
    return !!this.entity && !!this.entity.hasActualContract ? 'Active' : 'Not active';
  }

  public isEditableVersion(): boolean {
    return !!this.entity && this.entity.entityState === EntityState.ACTUAL;
  }

  public canPublish(): boolean {
    return this.mode === ProfileCardMode.view && this.isEditableVersion()
      && this.vocabulary.codeById(this.companyStates, this.entity.stateId) !== 'on';
  }

  public getCompanyTypeCssClassName(typeId: number): string {
    return typeId
      ? `h21-chip__company-${this.vocabulary.nameById(this.vocabulary.companyType, typeId).replace(' ', '-').toLowerCase()}`
      : '';
  }

  public isChina(): boolean { return this.entity && this.entity.countryCode === CountryType.Cn; }
  public isRussia(): boolean { return this.entity && this.entity.countryCode === CountryType.Ru; }

  public isOtherCountry(): boolean {
    return (this.entity && this.entity.countryCode && !this.isChina() && !this.isRussia());
  }

  private _getViewMode(): ProfileCardMode {
    if (this.id) {
      return ProfileCardMode.view;
    }
    this.setReferences();
    return ProfileCardMode.add;
  }

  private _setCountryList(): void {
    this._references.getCountries()
      .pipe(takeUntil(this._destroy$))
      .subscribe({ next: (e) => this.countries = e.sort((n1, n2) => (n1.name > n2.name ? 1 : -1)) });
  }

  private _updateValidation() {
    const controls = this.entityForm.controls;
    this._formValidationService.updateValidation(this.isRussia(), this.isChina(),
      this.isOtherCountry(), this._clearIfChanged, controls);
  }

  private _getCompanyTypes(): ICodeNamedEntity[] {
    if (Application.AGENT_OFFICE === this.core.application && this.entity.isAgentOffice) {
      return this.vocabulary.agentCompanyType;
    }
    return this.vocabulary.companyType;
  }

}

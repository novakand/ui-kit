import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatHorizontalStepper } from '@angular/material';

import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { forkJoin, Observable, Subject } from 'rxjs';

// services
import { SysadminVocabularyService } from '../../services/sysadmin-vocabulary.service';
import { SettingsService } from '../../services/settings.service';
import { LinkDialogService } from './link-dialog.service';

// tokens
import { DIALOG_PANEL_DATA } from '../h21-dialog-panel/h21-dialog-panel.tokens';

// interfaces
import { IH21DialogPanel } from '../h21-dialog-panel/h21-dialog-panel.interface';
import { ICompanyProfileLink } from './company-profile-link.interface';
import { INamedEntity } from '../../interfaces/named-entity.interface';

// animations
import { ToggleSlideAnimation } from '../../animations/toggle-slide';

// enums
import { AnimationState } from '../../enums/animation-state';
import { Application, PanelAction } from '../../enums';

// models
import { UserProfile } from '../../models/user-profile.model';
import { UserProfileLink } from './user-profile-link.model';
import { ILinkDialog } from './link-dialog.interface';

@Component({
  selector: 'h21-links-dialog',
  templateUrl: './links-dialog.component.html',
  animations: [ToggleSlideAnimation],
})
export class LinksDialogComponent implements OnInit, OnDestroy, AfterViewInit {

  public animationState: AnimationState;
  public animationStateChanged = new EventEmitter<AnimationEvent>();
  public firstForm: FormGroup;
  public secondForm: FormGroup;
  public inProgress: boolean;
  public noProgress: boolean;
  public showEnterHint: boolean;
  public title: string;

  public keyUp = new Subject<{ event: any; text: string }>();

  public activeStep: number;
  public userProfileId: number;
  public userProfileLinkId: number;

  public userProfile: UserProfile;
  public selectedCompany: ICompanyProfileLink;
  public companies: ICompanyProfileLink[];
  public roles$: Observable<INamedEntity[]>;

  @ViewChild('container') private _container: ElementRef;
  @ViewChild('stepper') private _stepper: MatHorizontalStepper;

  private _destroy$ = new Subject<boolean>();

  constructor(
    private _cdr: ChangeDetectorRef,
    private _settings: SettingsService,
    private _service: LinkDialogService,
    private _vocabulary: SysadminVocabularyService,
    @Inject(DIALOG_PANEL_DATA) private _dialogPanel: IH21DialogPanel<ILinkDialog>,
  ) {
    this.keyUp
      .pipe(
        distinctUntilChanged((prev, curr) => curr.event.key !== 'Enter' && prev.text === curr.text),
        debounceTime(300),
        map((data) => {
          const event = <KeyboardEvent> data.event;
          const text = data.text;
          this.showEnterHint = text.length > 0 && text.length < 3;

          return { isEnter: event.key === 'Enter', text };
        }),
        takeUntil(this._destroy$),
      )
      .subscribe((x) => (x.isEnter || x.text.length > 2) && this.search(x.text));

    this.search();
  }

  public ngOnInit() {
    this.userProfile = this._dialogPanel.data.userProfile;
    this.userProfileId = this._dialogPanel.data.userProfileId;
    this.userProfileLinkId = this._dialogPanel.data.userProfileLinkId;
    this.title = this.userProfileLinkId ? 'Role' : 'Select company';

    this._stepper.selectionChange
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: ($event: StepperSelectionEvent) => { this.activeStep = $event.selectedIndex; },
      });

    this._init();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public companyType(id: number): string {
    return this._vocabulary.fieldById(this._vocabulary.companyType, id, 'name');
  }

  public getCompanyTypeCssClassName(typeName: string): string {
    return typeName ? `h21-chip__company-${typeName.replace(' ', '-').toLowerCase()}` : '';
  }

  public ngAfterViewInit() {
    this._container.nativeElement.focus();
  }

  public trackByFn(index: number): number {
    return index;
  }

  public onAnimationStart(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  public onAnimationDone(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  public search(pattern?: string): void {
    this.inProgress = true;
    this.noProgress = false;

    this._service.getCompanies(pattern)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (items: ICompanyProfileLink[]) => {
          this.inProgress = false;
          this.companies = items;
          this.noProgress = !this.companies || !this.companies.length;
        },
      });
  }

  public companyIsSelected(company: any): boolean {
    return this.firstForm.get('companyId').value === company.id;
  }

  public selectCompany(company: ICompanyProfileLink): void {
    this.firstForm.get('companyId').setValue(company.id);
    this._setSelectedCompany(company);
  }

  public close(): void {
    this._dialogPanel.data.action = PanelAction.CANCEL;
    this._dialogPanel.data.overlay.detach();
  }

  public save(): void {
    if (this.userProfileLinkId && this.secondForm.invalid) {
      return;
    }

    this.inProgress = true;

    this._service.saveUserProfileLink(this._getNewUserProfileLink())
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          this._dialogPanel.data.action = PanelAction.SAVE;
          this._dialogPanel.data.overlay.detach();
          this.inProgress = false;
        },
        error: () => this.inProgress = false,
      });
  }

  private _init(): void {
    this.secondForm = new FormGroup({
      jobTitle: new FormControl(''),
      roleId: new FormControl('', Validators.required),
    });

    if (!this.userProfileLinkId) {
      this.firstForm = new FormGroup({
        companyId: new FormControl('', Validators.required),
      });
    } else {
      this._loadCompany(this._dialogPanel.data.companyProfileId);
    }
  }

  private _getNewUserProfileLink(): UserProfileLink {
    const roleIds: number[] = this.secondForm.controls.roleId.value;
    const jobTitle: string = this.secondForm.controls.jobTitle.value;
    const isAdminOffice = Application.ADMIN_OFFICE === this._settings.environment.application;

    const link = new UserProfileLink({
      id: this.userProfileLinkId,
      companyProfileId: this.selectedCompany.id,
      userProfileId: this.userProfileId,
      roleIds: roleIds,
      jobTitle: jobTitle,
    });

    if (isAdminOffice) {
      link.withoutPublish = !this.userProfile.identityUserId;
    }

    return link;
  }

  private _loadCompany(companyProfileId: number): void {
    const userProfile$ = this._service.getUserProfileLink(this.userProfileLinkId);
    const companyProfile$ = this._service.getCompanyProfile(companyProfileId);

    this.inProgress = true;
    forkJoin([userProfile$, companyProfile$])
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: ([user, company]) => {
          this.secondForm.controls.roleId.setValue(user.roleIds);
          this.secondForm.controls.jobTitle.setValue(user.jobTitle);

          !company.id && (company.id = user.companyProfileId);

          this._setSelectedCompany(company);
          this.inProgress = false;
        },
        error: () => this.inProgress = false,
      });

  }

  private _setSelectedCompany(company: ICompanyProfileLink): void {
    this.roles$ = this._service.getRoles(company.typeId);
    this.selectedCompany = company;
    this._stepper.next();
  }

}

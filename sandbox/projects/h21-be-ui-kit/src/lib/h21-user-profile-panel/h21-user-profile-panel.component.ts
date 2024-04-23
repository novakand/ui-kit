import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, OnDestroy, ViewChild } from '@angular/core';

// external libs
import { BehaviorSubject, Subject } from 'rxjs';

// animation
import { UserProfilePanelAnimation } from '../../animations/h21-user-profile-panel';

// tokens
import { CORE_ENVIRONMENT } from '../h21-company-list/core-environment.token';

// interfaces
import { ICompanyProfileClaim } from '../h21-company-profile/interfaces/company-profile-claim.interface';
import { ICompanyProfile } from '../h21-company-list/interfaces/company-profile.interface';
import { ICoreEnvironment } from '../../interfaces/core-environment.interface';
import { IUserCardData } from './models/i-user-card-data';

// services
import { CompanySettingService } from '../h21-company-profile/services/company-setting.service';

// refs & tokens
import { COMPANY_PROFILE_CLAIM } from '../h21-company-profile/company-profile-claim.token';
import { H21UserProfilePanelRef } from './h21-user-profile-panel-ref';
import { DIALOG_DATA } from './h21-user-profile-panel.tokens';

@Component({
  selector: 'h21-h21-user-profile-panel',
  templateUrl: './h21-user-profile-panel.component.html',
  animations: UserProfilePanelAnimation,
  providers: [CompanySettingService],
})
export class H21UserProfilePanelComponent implements OnDestroy, AfterViewInit {

  public animationState: 'void' | 'enter' | 'leave' = 'enter';
  public animationStateChanged = new EventEmitter<AnimationEvent>();

  public dialogData: IUserCardData;
  public profile$ = new BehaviorSubject<ICompanyProfile>(null);

  @ViewChild('container') private _container: ElementRef;

  private _destroy$ = new Subject<boolean>();

  constructor(public dialogRef: H21UserProfilePanelRef,
              private _settingService: CompanySettingService,
              @Inject(DIALOG_DATA) _dialogData: IUserCardData,
              @Inject(CORE_ENVIRONMENT) core: ICoreEnvironment,
              @Inject(COMPANY_PROFILE_CLAIM) public companyClaim: ICompanyProfileClaim,
  ) {
    this.dialogData = _dialogData;
    this.dialogData.profile.id && this.profile$.next(this.dialogData.profile);
  }

  public ngAfterViewInit() {
    this._container.nativeElement.focus();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public onAnimationStart(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  public onAnimationDone(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  public startExitAnimation(): void {
    this.animationState = 'leave';
  }

  public close(): void {
    this.dialogRef.close();
  }

  public onActionClick(name: string): void {
    this.dialogRef.close(name);
  }

  public trackByFn(index) {
    return index;
  }

}

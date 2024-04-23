import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';

// external libs
import { pluck } from 'rxjs/operators';
import { Observable } from 'rxjs';

// animation
import { ToggleSlideAnimation } from '../../animations/toggle-slide';

// services
import { SysadminVocabularyService } from '../../services/sysadmin-vocabulary.service';
import { ProfileLinkService } from '../../services/profile-link.service';
import { SettingsService } from '../../services/settings.service';

// interfaces
import { ICompanyProfile } from '../h21-company-list/interfaces';

// models
import { CompanySelectData } from './company-select-data';
import { Query } from '../../models/query.model';

// refs & tokens
import { H21CompanySelectPanelRef } from './h21-company-select-panel-ref';
import { DIALOG_DATA_CSP } from './tokens/h21-company-select-panel.tokens';

@Component({
  selector: 'h21-company-select-panel',
  templateUrl: './h21-company-select-panel.component.html',
  animations: [
    ToggleSlideAnimation,
  ],
  providers: [
    ProfileLinkService,
  ],
})
export class H21CompanySelectPanelComponent implements OnInit, AfterViewInit {

  public animationState: 'void' | 'enter' | 'leave' = 'enter';
  public animationStateChanged = new EventEmitter<AnimationEvent>();

  public inProgress = true;
  public dialogData: CompanySelectData;

  public profiles: ICompanyProfile[];
  public selectedItem: ICompanyProfile;

  @ViewChild('container') private _container: ElementRef;

  constructor(private _http: HttpClient,
              private _settingsService: SettingsService,
              public dialogRef: H21CompanySelectPanelRef,
              public vocabulary: SysadminVocabularyService,
              @Inject(DIALOG_DATA_CSP) _dialogData: CompanySelectData,
  ) {
    this.dialogData = _dialogData;
    this.selectedItem = _dialogData.selected;
  }

  public ngOnInit(): void {
    this._loadData();
  }

  public ngAfterViewInit(): void {
    this._container.nativeElement.focus();
  }

  public select(profile: ICompanyProfile): void {
    if (!this.selectedItem || this.selectedItem.id !== profile.id) {
      this.selectedItem = profile;
      this.dialogData.isChanged = true;

      this.close();
    }
  }

  public isSelected(profile: ICompanyProfile): boolean {
    return this.selectedItem && (this.selectedItem.id === profile.id);
  }

  public close(): void {
    this.dialogData.selected = this.selectedItem;
    this.dialogRef.close();
  }

  public trackByFn(index): void {
    return index;
  }

  public onAnimation(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  public startExitAnimation(): void {
    this.animationState = 'leave';
  }

  public getCompanyTypeCssClassName(typeId: number): string {
    return typeId
      ? `h21-chip__company-${this.vocabulary.nameById(this.vocabulary.companyType, typeId).replace(' ', '-').toLowerCase()}`
      : '';
  }

  private _loadData(): void {
    this._getCompanies(this.dialogData.ids)
      .subscribe({
        next: (profiles) => {
          this.profiles = profiles;
          this.inProgress = false;
        },
        error: () => this.inProgress = false,
      });
  }

  private _getCompanies(ids: number[]): Observable<ICompanyProfile[]> {
    const _apiUrl = this._settingsService.environment.profileApi;
    const filter = new Query({
      filter: {
        typeIdIn: ids,
        isForSelectCompany: true,
      },
      withCount: false,
    });
    return this._http.post(`${_apiUrl}CompanyProfile/PostQuery`, filter)
    .pipe(
      pluck('items'),
    );
  }

}

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// libs
import { NgSelectComponent } from '@ng-select/ng-select';
import { takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';

// tokens
import { DIALOG_PANEL_DATA } from '../../../../h21-dialog-panel/h21-dialog-panel.tokens';

// enums
import { AnimationState } from '../../../../../enums/animation-state';
import { PanelAction } from '../../../../../enums/panel-action.enum';
import { ViewMode } from '../../../../../enums/view-mode.enum';

// models
import { DepartmentPanelData } from '../models/department-panel-data';
import { TravelerFilter } from '../models/traveler-filter.model';
import { Query } from '../../../../../models';

// interfaces
import { IH21DialogPanel } from '../../../../h21-dialog-panel/h21-dialog-panel.interface';
import { ICoreEnvironment } from '../../../../../interfaces/core-environment.interface';
import { IDepartment } from '../interfaces/department.interface';
import { ITraveler } from '../../../interfaces/traveler.interface';

// services
import { CompanySettingService } from '../../../services/company-setting.service';
import { DepartmentService } from '../../../services/department.service';

// animation
import { ToggleVisibilityAnimation } from '../../../../../animations/toggle-visibility';
import { ToggleSlideAnimation } from '../../../../../animations/toggle-slide';

// tokens
import { CORE_ENVIRONMENT } from '../../../../h21-company-list/core-environment.token';

@Component({
  selector: 'h21-department',
  templateUrl: './department.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [ToggleSlideAnimation, ToggleVisibilityAnimation],
  providers: [CompanySettingService],
})
export class DepartmentComponent implements OnInit, OnDestroy, AfterViewInit {

  public form: FormGroup;
  public viewMode: ViewMode;
  public sending: boolean;
  public isView: boolean;

  public animationState: AnimationState = AnimationState.ENTER;
  public animationStateChanged = new EventEmitter<AnimationEvent>();
  public travellers$ = new Subject<ITraveler[]>();
  public travellers: ITraveler[];

  private profileId: number;
  private _original: IDepartment;
  private _destroy$ = new Subject<boolean>();

  @ViewChild('container') private _container: ElementRef;

  constructor(private _service: DepartmentService,
              private _settingService: CompanySettingService,
              @Inject(CORE_ENVIRONMENT) private _core: ICoreEnvironment,
    @Inject(DIALOG_PANEL_DATA) private _panel: IH21DialogPanel<DepartmentPanelData>) {
    this.profileId = _panel.data.companyId;
    this.viewMode = this._panel.data.mode;
    this._buildForm();
  }

  public ngOnInit(): void {
    this.isView = this.viewMode === ViewMode.View;
    this._load();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public ngAfterViewInit() {
    this._container.nativeElement.focus();
  }

  public animationAction(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  public close(action: PanelAction = PanelAction.CLOSE): void {
    this._panel.data.action = action;
    this._panel.data.overlay.detach();
  }

  public toggleAll(isAll: boolean, select: NgSelectComponent): void {
    const list = isAll ? this.travellers.map((v) => v.id) : [];
    isAll && select.close();
    this.form.get('travelersId').setValue(list);
  }

  public cancel(): void {
    this._panel.data.overlay.detach();
  }

  public save(): void {
    this.sending = true;
    this._service.saveDepartment(this.form.value)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (department) => {
          this.form.patchValue(department);
          this._original = { ...department };
          this.close(PanelAction.SAVE);
        },
        complete: () => this.sending = false,
      });
  }

  public trackByFn(index: number): number {
    return index;
  }

  public searchTravelers(searchedText: string): void {
    searchedText = searchedText.toLocaleLowerCase();
    const filtered = this.travellers.filter((traveler) => {
      if (this.form.get('travelersId').value && this.form.get('travelersId').value.includes(traveler.id)) { return true; }
      if (traveler.firstName && traveler.firstName.toLocaleLowerCase().includes(searchedText)) { return true; }
      if (traveler.lastName && traveler.lastName.toLocaleLowerCase().includes((searchedText))) { return true; }
    });
    this.travellers$.next(filtered);
  }


  private _load(): void {
    forkJoin(
      this._service.getDepartment(this._panel.data.id),
    )
    .pipe(takeUntil(this._destroy$))
    .subscribe({
      next: ([department]) => {
        this._getTravellers(department);
      },
    });
  }

  private _isDisabled(): boolean {
    return this.viewMode === ViewMode.View;
  }

  private _getTravellers(department: IDepartment): void {
    const filter = new Query<TravelerFilter>({
      filter: new TravelerFilter({
        companyIn: [
          {
            id: this.profileId,
            typeId: this._panel.data.typeId,
          },
        ],
        companyProfileId: this.profileId,
      }),
    });
    this._service.getTravellers(filter)
      .pipe(takeUntil(this._destroy$))
      .subscribe((data) => {
        this.travellers = data;
        this.travellers$.next(data);
        department.id && this.form.patchValue(department);
        this.viewMode === ViewMode.Add && this.form.get('companyProfileId').setValue(this.profileId);
      });
  }

  private _buildForm(): void {
    this.form = new FormGroup({
      name: new FormControl({ value: null, disabled: this._isDisabled() }, Validators.required),
      travelersId: new FormControl({ value: null, disabled: this._isDisabled() }, Validators.required),
      companyProfileId: new FormControl(null),
      id: new FormControl(null),
    });
  }

}

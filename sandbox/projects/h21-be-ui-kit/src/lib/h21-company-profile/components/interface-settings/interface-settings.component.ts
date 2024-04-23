import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewRef
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';

// external libs
import { takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';

// services
import { ToolbarActionsService } from '../../../../services/toolbar-actions.service';
import { LoadProgressService } from '../../../../services/load-progress.service';
import { SettingsService } from '../../../../services/settings.service';
import { CompanyService } from '../../services/company.service';
import { Utils } from '../../../../services/utils';

// interfaces
import { IInterfaceSetting, IInterfaceSettingsItem, InterfaceSettingsService } from './interfaces';
import { INamedEntity } from '../../../../interfaces';
import { ICompany } from '../../interfaces';

// enums
import { ViewMode } from '../../../../enums';

// components
import { GeneralInfoComponent } from '../general-info';

@Component({
  selector: 'h21-interface-settings',
  templateUrl: './interface-settings.component.html',
  styleUrls: [ './interface-settings.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterfaceSettingsComponent implements OnDestroy, OnInit {

  @Input() public mode: ViewMode;
  @Input() public isAdmin: boolean;
  @Input() public company: ICompany;
  @Input() public cmp: GeneralInfoComponent;

  @Output() public emitMode: EventEmitter<ViewMode> = new EventEmitter<ViewMode>();
  @Output() public emitCompany: EventEmitter<ICompany> = new EventEmitter<ICompany>();

  public pending = true;
  public headerHeight = '58px';

  public viewMode = ViewMode;
  public companyData: ICompany;

  public defaultPageCtrl = new FormControl();
  public defaultPages = new BehaviorSubject<INamedEntity[]>(null);

  public dashboardSettingsGroup: IInterfaceSetting[] = [];
  public searchAndBookSettingsGroup: IInterfaceSetting[] = [];
  public globalSettingsGroup: InterfaceSettingsService[] = [];

  private _destroy$ = new Subject<boolean>();

  constructor (
    private _http: HttpClient,
    private _cdr: ChangeDetectorRef,
    private _companyService: CompanyService,
    private _settingsService: SettingsService,
    private _toolbarActions: ToolbarActionsService,
    private _loadProgressService: LoadProgressService,
  ) { }

  public ngOnInit(): void {
    this.companyData = Utils.deepCopy(this.company);

    setTimeout(() => { this._setToolbarActions(); }, 0);
    this._getSettings();
    this._getDefPages();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public trackByFn(index: number): number {
    return index;
  }

  public onDefaultPageChanged(page: INamedEntity): void {
    this.companyData.defaultPage = page.description;
  }

  public onToggleChange(id: number, state: boolean, method: string = 'UpdateShow'): void {
    this.pending = true;
    this._loadProgressService.show(2);
    const updated$ = this._http.post(
      `${this._settingsService.environment.profileApi}CompanyInterfaceSetting/${method}`, { id: id, state: state },
    ).pipe(
      takeUntil(this._destroy$),
    );
    updated$.subscribe(() => {
      this.pending = false;
      this._loadProgressService.hide(2);
      this._cdr.detectChanges();
    });
  }

  public save(): void {
    if (this.cmp.isInvalid()) {
      this.emitCompany.emit(this.companyData);
      return;
    }
    this._updateMode(ViewMode.View);
    this.cmp.form.patchValue(this.companyData);
    this.cmp.save();
  }

  private _setSettingGroup(data: IInterfaceSettingsItem): void {
    this.globalSettingsGroup = data.services;
    this.dashboardSettingsGroup = data.settings.filter((item) => !item.settingIsForSearchAndBook);
    this.searchAndBookSettingsGroup = data.settings.filter((item) => item.settingIsForSearchAndBook);
  }

  private _getSettings(): void {
    this.pending = true;
    this._loadProgressService.show(2);
    const settings$ = this._http.get<IInterfaceSettingsItem>(
      `${this._settingsService.environment.profileApi}CompanyInterfaceSetting/GetSettingsByCompany?id=${this.company.id}`,
    ).pipe(
      tap((setting) => this._setSettingGroup(setting)),
      takeUntil(this._destroy$),
    );
    settings$.subscribe(() => {
      this.pending = false;
      this._loadProgressService.hide(2);
      this._cdr.detectChanges();
    });
  }

  private _getDefPages(): void {
    const pages$ = this._http.get<INamedEntity[]>(
      `${this._settingsService.environment.profileApi}CompanyInterfaceSetting/DefaultPages`,
    ).pipe(
      tap((pages) => this._initDefPage(pages)),
      takeUntil(this._destroy$),
    );
    pages$.subscribe((pages) => this.defaultPages.next(pages));
  }

  private _initDefPage(pages: INamedEntity[]): void {
    const curPage = pages.find((page) => page.description === this.company.defaultPage);
    this.defaultPageCtrl.setValue(curPage || pages[0]);
  }

  private _cancel(): void {
    this.emitCompany.emit(this.companyData);
    this.company = Utils.deepCopy(this.companyData);
    this._updateMode(ViewMode.View);
  }

  private _edit(): void {
    this._updateMode(ViewMode.Edit);
  }

  private _updateMode(mode: ViewMode): void {
    this.mode = mode;
    this.emitMode.emit(this.mode);
    this._setToolbarActions();
    !(<ViewRef>this._cdr).destroyed && this._cdr.detectChanges();
  }

  private _setToolbarActions(): void {
    this._toolbarActions.actions$.next([
      {
        name: 'save',
        disabled: false,
        tooltipText: 'Save',
        icon: 'save',
        action: () => this.save(),
        visible: this.mode !== ViewMode.View,
      },
      {
        name: 'cancel',
        disabled: false,
        tooltipText: 'Cancel',
        icon: 'undo',
        action: () => this._cancel(),
        visible: this.mode !== ViewMode.View,
      },
      {
        name: 'edit',
        disabled: this.mode !== ViewMode.View,
        tooltipText: 'Edit',
        icon: 'edit',
        action: () => this._edit(),
        visible: this.isAdmin && this.mode !== ViewMode.Add,
      },
    ]);
  }

}

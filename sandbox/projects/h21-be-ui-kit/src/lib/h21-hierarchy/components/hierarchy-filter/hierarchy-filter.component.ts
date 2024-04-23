import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit, ViewChild
} from '@angular/core';

// components
import { H21FilterComponent } from '../../../h21-filter/components/h21-filter';

// interfaces
import { IH21DialogPanel } from '../../../h21-dialog-panel';

// tokens
import { DIALOG_PANEL_DATA } from '../../../h21-dialog-panel/h21-dialog-panel.tokens';

// models
import { BaseControl } from '../../../h21-filter/models';
import { ProfileLinkFilter } from '../../../../models';
import { HierarchyPanelData } from '../../models';

// services
import { SysadminVocabularyService } from '../../../../services/sysadmin-vocabulary.service';

// animation
import { ToggleVisibilityAnimation } from '../../../../animations/toggle-visibility';
import { ToggleSlideAnimation } from '../../../../animations/toggle-slide';

// enums
import { AnimationState, PanelAction } from '../../../../enums';

@Component({
  selector: 'h21-hierarchy-filter',
  templateUrl: './hierarchy-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [ToggleSlideAnimation, ToggleVisibilityAnimation],
})
export class HierarchyFilterComponent implements OnInit, AfterViewInit {

  public animationState: AnimationState = AnimationState.ENTER;
  public animationStateChanged = new EventEmitter<AnimationEvent>();

  public controls: BaseControl[] = [];

  private readonly _filter: ProfileLinkFilter;

  @ViewChild('container') private _container: ElementRef;
  @ViewChild('filterComponent') private _filterComponent: H21FilterComponent;

  constructor(
    private _cdr: ChangeDetectorRef,
    private _vocabulary: SysadminVocabularyService,
    @Inject(DIALOG_PANEL_DATA) public dialog: IH21DialogPanel<HierarchyPanelData>,
  ) {
    this._filter = this.dialog.data.filter;
  }

  public ngOnInit() {
    this._initControls();
  }

  public ngAfterViewInit() {
    this._container.nativeElement.focus();
  }

  public onAnimation(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  public close(): void {
    this.dialog.data.action = PanelAction.CLOSE;
    this.dialog.data.overlay.detach();
  }

  public onEmitSubmit(filter: ProfileLinkFilter): void {
    this.dialog.data.filter = filter;
    this.dialog.data.overlay.detach();
  }

  public reset(): void {
    this._filterComponent.reset();
  }

  public submit(): void {
    this._filterComponent.form.valid && this._filterComponent.submit();
  }

  private _initControls(): void {
    this.controls = [
      new BaseControl({
        value: this._filter ? this._filter.shortNameContains : null,
        key: 'shortNameContains',
        label: 'Name',
        controlType: 'textbox',
      }),
      new BaseControl({
        value: this._filter ? this._filter.registrationNumberContains : null,
        key: 'registrationNumberContains',
        label: 'Registration number / INN',
        controlType: 'textbox',
      }),
      new BaseControl({
        value: this._filter ? this._filter.countryCode : null,
        key: 'countryCode',
        label: 'Country',
        controlType: 'countries-autocomplete',
      }),
      new BaseControl({
        value: this._filter ? this._filter.typeId : null,
        key: 'typeId',
        label: 'Type',
        selectValue: 'id',
        list: this._vocabulary.companyType,
        controlType: 'dropdown',
      }),
    ];
  }

}

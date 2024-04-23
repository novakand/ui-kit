import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ENTER, THREE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';

// external libraries
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

// components
import { DIALOG_PANEL_DATA } from '../../../../h21-dialog-panel/h21-dialog-panel.tokens';
import { IH21DialogPanel } from '../../../../h21-dialog-panel/h21-dialog-panel.interface';

// enums
import { AnimationState } from '../../../../../enums/animation-state';
import { PanelAction } from '../../../../../enums/panel-action.enum';
import { ViewMode } from '../../../../../enums/view-mode.enum';

// models
import { CompanyReferenceDialogData } from '../models/company-reference-dialog-data.model';

// animations
import { ToggleSlideAnimation,  } from '../../../../../animations/toggle-slide';
import { ToggleVisibilityAnimation } from '../../../../../animations/toggle-visibility';

// services
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'h21-company-reference-dialog',
  templateUrl: './company-reference-dialog.component.html',
  styleUrls: [ './company-reference-dialog.component.scss' ],
  animations: [ ToggleSlideAnimation, ToggleVisibilityAnimation ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CompanyService],
})
export class CompanyReferenceDialogComponent implements AfterViewInit, OnDestroy {

  public animationState: AnimationState = AnimationState.ENTER;
  public animationStateChanged = new EventEmitter<AnimationEvent>();
  public modeTypes = ViewMode;

  public pending = false;
  public form: FormGroup;

  public mode = this._dialogPanel.data.mode;
  public referenceId = this._dialogPanel.data.referenceId;
  public companyProfileId = this._dialogPanel.data.companyProfileId;

  public get valuesActual(): AbstractControl {
    return this.form.get('valuesActual');
  }

  private _destroy$ = new Subject<boolean>();

  @ViewChild('container') private _container: ElementRef;
  @ViewChild('chipInput') private _chipInput: ElementRef;

  constructor(
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _service: CompanyService,
    @Inject(DIALOG_PANEL_DATA) private _dialogPanel: IH21DialogPanel<CompanyReferenceDialogData>,
  ) {
    this._buildForm();
    this.referenceId && this._load();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public ngAfterViewInit() {
    this._container.nativeElement.focus();
  }

  public onAnimationStart(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  public onAnimationDone(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  public onSubmit(): void {
    if (this.form.invalid) { return; }
    this.pending = true;
    this.form.disable();

    const saved$ = this._service.saveReference(this.form.value).pipe(takeUntil(this._destroy$));
    saved$.subscribe(() => this.close(PanelAction.SAVE));
  }

  public cancel(): void {
    this.close(PanelAction.CANCEL);
  }

  public close(action: PanelAction = PanelAction.CLOSE): void {
    this._dialogPanel.data.action = action;
    this._dialogPanel.data.overlay.detach();
  }

  public trackByFn(index: number): number {
    return index;
  }

  public onBackSpace(event: KeyboardEvent): void {
    event.stopImmediatePropagation();
  }

  public onEdit(): void {
    if (this.valuesActual.value.length && !this.form.get('editableTag').value) {
      const { value } = this.valuesActual;
      this.form.get('editableTag').setValue(value.pop().value);
      this._chipInput.nativeElement.focus();
    }
  }

  public removeValue(index: number): void {
    this.valuesActual.value.splice(index, 1);
    this.valuesActual.updateValueAndValidity();
  }

  public addValue($event: MatChipInputEvent): void {
    const i = this.valuesActual.value.findIndex((e) => e === $event.value);
    if (i === -1 && $event.value) {
      this.valuesActual.value.push({
        value: $event.value,
        companyReferenceId: this.form.get('id').value,
      });
      $event.input.value = '';
      this.valuesActual.updateValueAndValidity();
      this.form.get('editableTag').reset();
    }
  }

  private _buildForm(): void {
    this.form = this._fb.group({
      id: [null],
      name: [null, [ Validators.required ]],
      enable: [false],
      mandatory: [true],
      companyProfileId: [this.companyProfileId],
      isIncludeForAnonymousTraveler: [true],
      isShowInIndividualInvoice: [false],
      isShowInMyBookings: [false],
      valuesActual: [[]],
      editable: [false],
      editableTag: [],
    });
  }

  private _load(): void {
    this.pending = true;
    this.form.disable();
    const reference$ = this._service.getReference(this.referenceId)
                           .pipe(
                             tap((data) => this.form.patchValue(data)),
                             takeUntil(this._destroy$),
                           );
    reference$.subscribe(() => {
      this.form.enable();
      this.pending = false;
      this._cdr.detectChanges();
    });
  }

}

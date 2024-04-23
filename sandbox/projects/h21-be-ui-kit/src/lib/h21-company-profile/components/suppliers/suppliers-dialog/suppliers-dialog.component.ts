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
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

// external libraries
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

// components
import { DIALOG_PANEL_DATA } from '../../../../h21-dialog-panel/h21-dialog-panel.tokens';
import { IH21DialogPanel } from '../../../../h21-dialog-panel/h21-dialog-panel.interface';

// enums
import { ConfirmResult } from '../../../../../enums/confirm-result.enum';
import { AnimationState } from '../../../../../enums/animation-state';
import { PanelAction } from '../../../../../enums/panel-action.enum';

// animations
import { ToggleVisibilityAnimation } from '../../../../../animations/toggle-visibility';
import { ToggleSlideAnimation,  } from '../../../../../animations/toggle-slide';

// services
import { H21DefaultDialogService } from '../../../../dialogs/h21-default-dialog.service';
import { FileUploaderService } from '../../../../../services/file-uploader.service';
import { HttpClientService } from '../../../../../services/http-client.service';
import { ProfileProviderService } from '../services/profile-provider.service';
import { SettingsService } from '../../../../../services/settings.service';
import { Utils } from '../../../../../services/utils';

// interfaces
import { ICompanyProfileProvider, IProfileProviderSetting } from '../interfaces';
import { IFileInfo } from '../../../../../interfaces';

@Component({
  selector: 'h21-suppliers-dialog',
  templateUrl: './suppliers-dialog.component.html',
  styleUrls: [ './suppliers-dialog.component.scss' ],
  animations: [ ToggleSlideAnimation, ToggleVisibilityAnimation ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ ProfileProviderService ],
})
export class SuppliersDialogComponent implements AfterViewInit, OnDestroy {

  public animationState: AnimationState = AnimationState.ENTER;
  public animationStateChanged = new EventEmitter<AnimationEvent>();

  public pending = false;
  public maxFileSizeError = false;
  public imageFormatError = false;
  public form: FormGroup;

  private _data = this._dialogPanel.data;
  private _destroy$ = new Subject<boolean>();

  @ViewChild('container') private _container: ElementRef;
  @ViewChild('fileInput') private _fileInput: HTMLInputElement;

  constructor(
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _http: HttpClientService,
    private _settings: SettingsService,
    private _uploader: FileUploaderService,
    private _service: ProfileProviderService,
    private _dialogs: H21DefaultDialogService,
    @Inject(DIALOG_PANEL_DATA) private _dialogPanel: IH21DialogPanel,
  ) {
    this._buildForm();
    this._load();
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

  public onSubmit(isValidate: boolean = true): void {
    if (isValidate && this.form.invalid) {
      return;
    }
    this.pending = true;
    this.form.disable();

    const saved$ = this._service.saveSetting(this.form.value).pipe(takeUntil(this._destroy$));
    saved$.subscribe(() => this.close(PanelAction.SAVE));
  }

  public reset(): void {
    const afterClosed$ = this._dialogs.confirm(
      'Reset',
      'All your settings for all brand suppliers will be reset to standard. Are you sure?',
    ).afterClosed().pipe(takeUntil(this._destroy$));

    afterClosed$.subscribe({
      next: (result) => {
        result === ConfirmResult.No && this.close();
        result === ConfirmResult.Yes && this._resetAndSave();
      },
    });
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

  public removeLogo($event: MouseEvent): void {
    this.form.get('logo').reset();
    this.form.get('logoName').reset();
    $event.stopPropagation();
  }

  public uploadLogo($event: Event): void {
    if (this._checkSizeAndFormat($event)) { return; }

    this.pending = true;
    this.form.disable();

    const uploaded$ = this._uploader.upload(`${ this._settings.environment.fileStorageUrl }PostUpload/public`, $event)
      .pipe(
        tap((file) => this.form.get('logo').setValue(file)),
        switchMap((file) => this._http.downloadFileByHash(file.fileHash, '1', 'public')),
        tap((data) => this._setLogoUrl(data)),
      );
    uploaded$.subscribe({
      next: () => {
        this.pending = false;
        this.form.enable();
        this._cdr.detectChanges();
      },
      error: () => this.pending = false,
    });
  }

  private _resetAndSave(): void {
    this._reset();
    this.pending = true;
    this.form.disable();

    const saved$ = this._service.resetSetting(this.form.value).pipe(takeUntil(this._destroy$));
    saved$.subscribe(() => this.close(PanelAction.SAVE));
  }

  private _reset(): void {
    const { name, abbreviation, logo, ...base } = this.form.value;
    this.form.reset(base);
    (<FormArray>this.form.get('companyProfileProviders')).controls.forEach((fg: FormGroup) => {
      fg.get('isCustomize').setValue(false);
    });
  }

  private _setLogoUrl(data: Blob): void {
    const file = <IFileInfo>this.form.get('logo').value;
    file.fileUrl = Utils.getUrlFromBlob(file.fileName, data);
    this.form.get('logo').setValue(file);
    this.form.get('logoName').setValue(file.fileName);
  }

  private _buildForm(): void {
    this.form = this._fb.group({
      id: [null],
      companyProfileId: [null],
      description: [null],
      name: [null, [ Validators.required ]],
      abbreviation: [null, [ Validators.required ]],
      logo: [null],
      logoName: [null],
      companyProfileProviders: this._fb.array([]),
    });
  }

  private _load(): void {
    this.pending = true;
    this.form.disable();
    const data$ = this._service.getSettingByCompanyId(this._data.companyProfileId)
      .pipe(
        tap((data) => this._fillForm(data)),
        takeUntil(this._destroy$),
      );
    data$.subscribe(() => {
        this.pending = false;
        this.form.enable();
        this._cdr.detectChanges();
      });
  }

  private _fillForm(data: IProfileProviderSetting): void {
    const result = data.id ? data : { companyProfileId: this._data.companyProfileId };
    this.form.patchValue(result);
    data.companyProfileProviders && this._addProviders(data.companyProfileProviders);
  }

  private _checkSizeAndFormat(selectFileEvent: Event): boolean {
    const fileEvent = <HTMLInputElement> selectFileEvent.target;
    this.maxFileSizeError = !this._uploader.checkFileSize(fileEvent.files, { maxSize: 200 }).isCorrect;
    this.maxFileSizeError && this.form.get('logoName').setErrors({ maxFileSizeError: true });

    const correctFormats: string[] = ['image/jpeg', 'image/png'];
    this.imageFormatError = !this._uploader.checkFileFormat(fileEvent.files, correctFormats);
    this.imageFormatError && this.form.get('logoName').setErrors({ imageFormatError: true });

    return this.maxFileSizeError || this.imageFormatError;
  }

  private _addProviders(providers: ICompanyProfileProvider[]): void {
    const arr = <FormArray>this.form.controls.companyProfileProviders;

    providers.forEach((value, index) => {
      const group = this._fb.group({
        companyProfileId: [value.companyProfileId],
        providerName: [value.providerName],
        providerTypeId: [value.providerTypeId],
        isCustomize: [value.isCustomize],
        index: [index],
        id: [value.id],
      });
      arr.push(group);
    });
  }

}

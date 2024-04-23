import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject, OnDestroy, ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material';

import { OAuthService } from 'angular-oauth2-oidc';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { H21DefaultDialogService } from '../dialogs/h21-default-dialog.service';
import { H21ThemeElementsService } from './services/h21-theme-elements.service';
import { H21ProfileSaverService } from './services/h21-profile-saver.service';
import { H21StorageThemeService } from './services/h21-storage-theme.service';
import { FileUploaderService } from '../../services/file-uploader.service';
import { HttpClientService } from '../../services/http-client.service';
import { SettingsService } from '../../services/settings.service';
import { H21ThemeService } from './services/h21-theme.service';
import { Utils } from '../../services/utils';

import { WhiteLabelAnimation } from '../../animations/h21-white-lable';
import { DIALOG_DATA_WL } from './tokens/h21-white-label.token';
import { H21WhiteLabelRef } from './h21-white-label-ref';

import { WhiteLabelTab } from './models/white-label-tab.enum';
import { IFileInfo } from '../../interfaces/file-info.interface';
import { IconType } from '../dialogs/enums/icon-type';
import { Query } from '../../models/query.model';
import { IUser } from '../../models/user.model';
import { Theme } from './models/theme.model';
import { Logo } from './models/logo.model';

const defTheme = new Theme({
  name: '',
  logoFileName: 'logo.svg',
  logoFileUrl: './assets/img/logo.svg',
  logoFileHash: '85E00784C31EC7A369D6A714DBD240F6',
  isDark: false,
  isDefault: false,
  elements: [
    {
      id: null, name: 'Header background color', colorHexCode: null, colorRgbCode: null,
      contrastHexCode: null, contrastRgbCode: null, property: 'header',
    },
    {
      id: null, name: 'Left panel background color', colorHexCode: null, colorRgbCode: null,
      contrastHexCode: null, contrastRgbCode: null, property: 'leftPanel',
    },
    { id: null, name: 'Text body color', colorHexCode: null, colorRgbCode: null, property: 'text' },
    { id: null, name: 'Text body accent color', colorHexCode: null, colorRgbCode: null, property: 'textAccent' },
    {
      id: null, name: 'Primary color', colorHexCode: null, colorRgbCode: null,
      contrastHexCode: null, contrastRgbCode: null, property: 'primary',
    },
    {
      id: null, name: 'Secondary color', colorHexCode: null, colorRgbCode: null,
      contrastHexCode: null, contrastRgbCode: null, property: 'accent',
    },
    {
      id: null, name: 'Error color', colorHexCode: null, colorRgbCode: null,
      contrastHexCode: null, contrastRgbCode: null, property: 'warn',
    },
    {
      id: null, name: 'Success color', colorHexCode: null, colorRgbCode: null,
      contrastHexCode: null, contrastRgbCode: null, property: 'success',
    },
    { id: null, name: 'Border color', colorHexCode: null, colorRgbCode: null, property: 'border' },
  ],
});

@Component({
  selector: 'h21-white-label',
  templateUrl: './h21-white-label.component.html',
  animations: WhiteLabelAnimation,
})
export class H21WhiteLabelComponent implements OnDestroy, AfterViewInit {

  get fileIsCorrect(): boolean { return this._fileIsCorrect; }

  get incorrectFileText(): string { return this._incorrectFileText; }

  get inProgress() { return this._inProgress; }

  get hasProgress() { return this._hasProgress; }

  public current: Theme;
  public previous: Theme;

  public themes: Theme[];
  public themeName: FormControl;

  public isProfilesTab: boolean;
  public isCustomColorsTab: boolean;
  public isProfileWlAvailable: boolean;
  public isDeleteLogoAvailable: boolean;
  public selectedTab = WhiteLabelTab.DEFAULT_THEMES;

  public loadProfiles = new Subject<void>();
  public resetClick = new Subject<void>();

  public animationState: 'void' | 'enter' | 'leave' = 'enter';
  public animationStateChanged = new EventEmitter<AnimationEvent>();
  public _fileIsCorrect = true;

  private _incorrectFileText = '';
  private _wlProfileIsSelected = false;

  private _inProgress: boolean;
  private _hasProgress: boolean;

  private _destroy$ = new Subject<void>();

  @ViewChild('container') private _container: ElementRef;
  @ViewChild('fileInput') private _fileInput: ElementRef;

  constructor(private _auth: OAuthService,
              private _http: HttpClientService,
              private _service: H21ThemeService,
              private _settings: SettingsService,
              private _dialogRef: H21WhiteLabelRef,
              private _uploader: FileUploaderService,
              private _saverService: H21ProfileSaverService,
              @Inject(DIALOG_DATA_WL) private _dialogData: any,
              private _storageService: H21StorageThemeService,
              private _elementService: H21ThemeElementsService,
              private _dialogService: H21DefaultDialogService,
  ) {
    this.current = this._storageService.currentTheme() || this._deepCopy(defTheme);

    this._downloadByHash();
    this._getDefThemes();

    this.isProfileWlAvailable = this._isAdmin();
    this.themeName = new FormControl(this.current.name, [Validators.required]);

    this.previous = this._deepCopy(this.current);
    this._saverService.panelClose
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (closing) => {
          if (closing) {
            this._showMessage('Your changes saved successfully', IconType.Success);
          } else {
            this._showMessage('Your changes not saved', IconType.Warning);
          }
        },
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public ngAfterViewInit() {
    this._container.nativeElement.focus();
  }

  public setWlProfileSelected(selected: boolean) {
    this._wlProfileIsSelected = selected;
  }

  public isDisabled(): boolean {
    if (this._wlProfileIsSelected && this.current.isDefault) {
      return false;
    }
    return !(this._wlProfileIsSelected && this.themeName.valid);
  }

  public onAnimation(event: AnimationEvent): void { this.animationStateChanged.emit(event); }
  public startExitAnimation(): void { this.animationState = 'leave'; }
  public close(): void { this._dialogRef.close(); }

  public apply(): void {
    if (this.themeName.dirty) {
      this.current.name = this.themeName.value;
    }
    this._storageService.update(this.current);
  }

  public next(): void {
    if (this.themeName.dirty) {
      this.current.name = this.themeName.value;
    }
    this._storageService.update(this.current);
    this.selectedTab = WhiteLabelTab.PROFILES;
  }

  public export(): void {
    this.themeName.dirty && (this.current.name = this.themeName.value);
    this._fillLogo();
    this._service.exportTheme(this.current);
  }

  public save(): void {
    this._fillLogo();
    this._inProgress = true;
    this._service.save(this.current)
      .subscribe({
        next: (theme) => {
          this.current.id = theme.id;
          this._saveElements(theme);
          this._saverService.emitCurrentTheme(this.current);
          this._inProgress = false;
        },
      });
  }

  public reset(): void {
    this.current = this._deepCopy(this.previous);
    this.themeName.setValue(this.current.name);
    this._storageService.update(this.current);
    this.resetClick.next();
  }

  public onChange(theme: Theme): void {
    this.current = theme;
    this.themeName.setValue(theme.name);
    this._downloadByHash();
  }

  public onChangeTab(event: MatTabChangeEvent): void {
    this.selectedTab = event.index;
    this.isProfilesTab = event.index === WhiteLabelTab.PROFILES;
    this.isCustomColorsTab = event.index === WhiteLabelTab.CUSTOM_COLORS;
    this.isDeleteLogoAvailable = event.index !== WhiteLabelTab.DEFAULT_THEMES;

    switch (event.index) {
      case WhiteLabelTab.CUSTOM_COLORS:
        this.current = (this._cloneCurrentTheme() || this._deepCopy(defTheme));
        break;
      case WhiteLabelTab.PROFILES:
        this.loadProfiles.next();
        break;
    }
    this.themeName.dirty && (this.current.name = this.themeName.value);
  }

  public trackByFn(index: number): number { return index; }

  public uploadLogo(e: Event): void {
    this._checkSizeAndFormat(e);
    if (this.fileIsCorrect) {
      this._uploader
        .upload(`${ this._settings.environment.fileStorageUrl }PostUpload`, e)
        .subscribe({
          next: (x: IFileInfo) => {
            this.current.logoFileUrl = x.fileUrl;
            this.current.logoFileName = x.fileName;
            this.current.logoFileHash = x.fileHash;
            this._downloadByHash();
          },
          error: () => { this._inProgress = false; },
        });
    }
  }

  public deleteLogo(): void {
    this.current.logoFileUrl = null;
    this.current.logoFileHash = null;
    this.current.logoFileName = null;
    this._fileInput.nativeElement.value = '';
  }

  public hexToRgb(event: any): string {
    const hexColor = event.value;
    const rgbColor = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
    return rgbColor ?
      `${ parseInt(rgbColor[1], 16) }, ${ parseInt(rgbColor[2], 16) }, ${ parseInt(rgbColor[3], 16) }`
      : null;
  }

  public hasContrastColor(name: string): boolean {
    const colors = ['Text body color', 'Text body accent color', 'Border color'];
    return !colors.includes(name);
  }

  private _cloneCurrentTheme(): Theme {
    const clone = this._deepCopy(this.current);
    clone.id = null;
    clone.isDefault = false;
    clone.elements.forEach((element) => {
      element.id = null;
      element.themeId = null;
    });
    return clone;
  }

  private _isAdmin(): boolean {
    const user: IUser = <IUser> this._auth.getIdentityClaims();
    return user && user.role && user.role.includes('admin');
  }

  private _getDefThemes(): void {
    const query = new Query<any>({ filter: { isDefault: true } });
    this._inProgress = true;
    this._service.find(query)
      .subscribe({
        next: (result) => {
          this.themes = result.items;
          this._fillElements(this.themes.map((theme) => theme.id));
          this._inProgress = false;
        },
      });
  }

  private _saveElements(theme: Theme): void {
    this.current.elements.forEach((element) => { element.themeId = theme.id; });

    this._elementService.save(this.current.elements)
      .subscribe({ next: () => { } });
  }

  private _fillElements(themeIds: number[]): void {
    const elementsQuery = new Query<any>({ filter: { ThemeIdIn: themeIds } });

    this._elementService.find(elementsQuery)
      .subscribe({
        next: (result) => {
          const grouped = this._elementService.groupByThemeId(result.items);
          this.themes.forEach((theme) => {
            theme.elements = grouped[theme.id];
          });
        },
      });
  }

  private _downloadByHash(): void {
    this.current.logoFileHash &&
    this._http.downloadFileByHash(this.current.logoFileHash, '1').pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (data) => {
          this.current.logoFileUrl = Utils.getUrlFromBlob(this.current.logoFileName, data);
          this._inProgress = false;
        },
        error: () => { this._inProgress = false; },
      });
  }

  private _fillLogo(): void {
    this.current.logo = new Logo({
      fileUrl: this.current.logoFileUrl,
      fileName: this.current.logoFileName,
      fileHash: this.current.logoFileHash,
    });
  }

  private _deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  private _checkSizeAndFormat(selectFileEvent: Event) {
    const fileEvent = <HTMLInputElement> selectFileEvent.target;
    if (!fileEvent || fileEvent.files.length < 1) {
      this._fileIsCorrect = true;
    }

    const checkSizeResult = this._uploader.checkFileSize(fileEvent.files, { maxSize: 200 });
    !checkSizeResult.isCorrect && (this._incorrectFileText = checkSizeResult.message);

    const correctFormats: string[] = ['image/svg+xml', 'image/png'];
    const checkFileFormatResult = this._uploader.checkFileFormat(fileEvent.files, correctFormats);

    if (!checkFileFormatResult) {
      this._incorrectFileText = `${ this._incorrectFileText } Valid formats are PNG and SVG with transparent background`;
    }

    this._fileIsCorrect = checkFileFormatResult && checkSizeResult.isCorrect;
  }

  private _showMessage(text: string, icon: IconType) {
    this._dialogService.message('Operation result', text, icon)
      .afterClosed()
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.close());
  }

}

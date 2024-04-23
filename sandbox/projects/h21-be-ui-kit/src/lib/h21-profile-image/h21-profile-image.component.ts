import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewRef
} from '@angular/core';

// interfaces
import { IFileInfo } from '../../interfaces/file-info.interface';

// services
import { FileUploaderService } from '../../services/file-uploader.service';
import { HttpClientService } from '../../services/http-client.service';
import { SettingsService } from '../../services/settings.service';
import { Utils } from '../../services/utils';

@Component({
  selector: 'h21-profile-image',
  templateUrl: './h21-profile-image.component.html',
  providers: [ HttpClientService, FileUploaderService ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class H21ProfileImageComponent implements OnInit {

  @Input()
  set file(value: IFileInfo) {
    if (value &&
      !(this._file && value.fileHash && this._file.fileHash === value.fileHash) &&
      !(this._file && value.fileUrl && this._file.fileUrl === value.fileUrl)) {
      this.inProgress = true;
    }

    this._file = value;
    this.setImg(this._file);
  }

  @Input()
  set fileHash(value: string) {
    if (value) {
      this.file = {
        fileHash: value,
      };
    }
  }

  @Input()
  set fileUrl(value: string) {
    if (value) {
      this.file = {
        fileUrl: value,
      };
    }
  }

  @Input() public folder: string;
  @Input() public alt: string;
  @Input() public firstName: string;
  @Input() public lastName: string;
  @Input() public readonly = true;
  @Input() public withBorder = false;
  @Input() public size: 'small' | 'medium' | 'large' | 'elastic' = 'medium';

  @Output() public fileChange: EventEmitter<IFileInfo> = new EventEmitter<IFileInfo>();

  public src: string;
  public inProgress = false;
  public progressDiameter: number;
  public progressStrokeWidth: number;

  private _file: IFileInfo;

  constructor(private _cdr: ChangeDetectorRef,
              private _http: HttpClientService,
              private _settings: SettingsService,
              private _uploader: FileUploaderService,
  ) {
    this.progressDiameter = 54;
    this.progressStrokeWidth = 2;
  }

  public ngOnInit(): void {
    switch (this.size) {
      case 'small':
        this.progressDiameter = 32;
        this.progressStrokeWidth = 2;
        break;
      case 'medium':
        this.progressDiameter = 54;
        this.progressStrokeWidth = 2;
        break;
      case 'large':
        this.progressDiameter = 160;
        this.progressStrokeWidth = 4;
        break;
      case 'elastic':
        this.progressDiameter = 100;
        this.progressStrokeWidth = 4;
    }
  }

  get nameIcon() {
    return this.alt ? this.alt
      : (this._firstChar(this.firstName) + this._firstChar(this.lastName));
  }

  public hasImage(): boolean {
    return !!this._file && (!!this._file.fileHash || !!this._file.fileUrl);
  }

  public showUploadButton(): boolean {
    return !this.readonly && !this.hasImage();
  }

  public showPicture(): boolean {
    return this.hasImage();
  }

  public showLabel(): boolean {
    return this.readonly && !this.hasImage();
  }

  public fileChanged(e: Event): void {
    this.inProgress = true;
    const url = `${this._settings.environment.fileStorageUrl}PostUpload/${this.folder ? `${this.folder}` : '' }`;

    this._uploader.upload(url, e)
      .subscribe({
        next: (x: IFileInfo) => {
          this.file = x;
          this.fileChange.emit(x);
          (<HTMLInputElement>e.target).value = '';
          this._cdr.detectChanges();
        },
      });
  }

  public setImg(file: IFileInfo): void {
    if (file && file.fileHash) {
      this._http.downloadFileByHash(file.fileHash, 'any', this.folder)
        .subscribe({
          next: (data: Blob) => {
            this.src = Utils.getUrlFromBlob(file.fileName, data);
            this.inProgress = false;
            !(<ViewRef>this._cdr).destroyed && this._cdr.detectChanges();
          },
        });
    } else if (file && file.fileUrl) {
      this.src = file.fileUrl;
      this.inProgress = false;
    } else {
      this.src = '';
      this.inProgress = false;
    }
    this._cdr.detectChanges();
  }

  public removeImage(): void {
    this.file = null;
    this.fileChange.emit(null);
  }

  private _firstChar(name: string): string {
    return name ? name[0] : '';
  }

}

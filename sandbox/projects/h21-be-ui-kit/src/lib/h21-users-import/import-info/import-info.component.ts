import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// external libs
import { takeUntil } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { Subject } from 'rxjs';

// interfaces
import { IHeader, IUploadResponse } from '../upload-response.interface';

// services
import { UserProfileImportService } from '../user-profile-import.service';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'h21-import-info',
  templateUrl: './import-info.component.html',
  providers: [UserProfileImportService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportInfoComponent implements OnInit, OnDestroy {

  public columns: string[];
  public importedCols: IHeader[];
  public expectedCols: IHeader[];
  public displayedCols: IHeader[];

  public buttonName: string;
  public importStarted = false;
  public readonly uploadResponse: IUploadResponse;

  private _missingCols: IHeader[] = [];
  private _unnecessaryCols: IHeader[] = [];

  private _destroy$ = new Subject<boolean>();

  constructor(private _router: Router,
              private _http: HttpClient,
              private _activeRoute: ActivatedRoute,
              private _settingsService: SettingsService,
              private _service: UserProfileImportService,
  ) {
    const response = this._activeRoute.snapshot.queryParamMap.get('uploadResponse');
    this.uploadResponse = JSON.parse(response);

    const cols = this.uploadResponse.headers;
    this.importedCols = cols.filter((col) => col.received);
    this.expectedCols = cols.filter((col) => col.required);
  }

  public ngOnInit(): void {
    this.buttonName = `Import ${this._service.importSettings.entityNames}`;
    this._fillCols(this.expectedCols, this.importedCols, this._missingCols);
    this._fillCols(this.importedCols, this.expectedCols, this._unnecessaryCols);
    this._setDisplayedCols();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public trackByFn(index): void {
    return index;
  }

  public downloadErrors(): void {
    const url = `${this._settingsService.environment.profileApi}FileInfo/GetDownload?hash=${this.uploadResponse.errorFileHash}`;
    this._http.get(url, { responseType: 'blob' })
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (data) => {
          const file = new File([data], 'errors.csv', { type: 'text/plain;charset=utf-8' });
          saveAs(file);
        },
      });
  }

  public startImport(): void {
    this.importStarted = true;
    this._service.startImport(this.uploadResponse);
  }

  public isMissingCol(name: IHeader): boolean {
    return this._missingCols.includes(name);
  }

  public isUnnecessaryCol(name: IHeader): boolean {
    return this._unnecessaryCols.includes(name);
  }

  public getTooltip(col: IHeader): string {
    if (this.isMissingCol(col)) {
      return 'Mandatory fields must be filled out.';
    }
    if (this.isUnnecessaryCol(col)) {
      return 'The system will miss unnecessary data.';
    }
    return null;
  }

  public showDownloadFileButton(): boolean {
    return !!this.uploadResponse.errorFileHash;
  }

  private _fillCols(first: IHeader[], second: IHeader[], target: IHeader[]): void {
    first.forEach((item) => {
      const exists = second.includes(item);
      !exists && target.push(item);
    });
  }

  private _setDisplayedCols(): void {
    const rstColumns = this.importedCols.concat(this.expectedCols);
    this.displayedCols = Array.from(new Set(rstColumns));

    this.columns = this.displayedCols.map((t) => t.name);
  }

}

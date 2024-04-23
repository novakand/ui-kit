import { HttpClient, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

// tokens
import { IMPORT_SETTINGS } from './import-settings.token';

// enums
import { Application } from '../../enums';
import { ImportType } from './import-type.enum';

// services
import { H21DefaultDialogService } from '../dialogs/h21-default-dialog.service';
import { SettingsService } from '../../services/settings.service';
import { SignalrService } from '../../services/signalr.service';

// models
import { Import } from './import.model';

// interfaces
import { IUploadResponse } from './upload-response.interface';
import { ImportSettings } from './import-settings.model';
import { PictureType } from '../h21-picture-lib';

@Injectable()
export class UserProfileImportService {

  public get importSettings(): ImportSettings {
    return this._importSettings;
  }

  private _importSettings: ImportSettings;
  private _baseUrl = this._settings.environment.profileApi;

  constructor(private _router: Router,
              private _http: HttpClient,
              private _settings: SettingsService,
              private _notification: SignalrService,
              private _dialog: H21DefaultDialogService,
              @Inject(IMPORT_SETTINGS) private _importType: ImportType,
  ) {
    this._setImportSettings(_importType);
  }

  public importUsers(event: EventTarget, file: File): void {
    if (!this._isCsv(file.name)) {
      (<HTMLInputElement>event).value = '';
      this._dialog.error('Error', 'Invalid file format. Acceptable format is CSV.');
      return;
    }
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const params = new HttpParams().set('ApplicationType', String(this._settings.environment.application));
    const req = new HttpRequest('POST', `${this._baseUrl}${this._importSettings.uploadUrl}`, formData, { params });
    this._uploadFile(req, () => { (<HTMLInputElement>event).value = ''; });
  }

  public startImport(result: IUploadResponse): void {
    const importBody = new Import({
      fileHash: result.originFileHash,
      connectionId: this._notification.context.connectionId,
      applicationType: this._settings.environment.application,
    });
    this._http.post(`${this._baseUrl}${this._importSettings.startImportUrl}`, importBody)
      .subscribe({
        next: () => {
          this._router.navigateByUrl(this._importSettings.baseRoute);
        },
      });
  }

  private _uploadFile(req: HttpRequest<FormData>, action: () => void): void {
    this._http.request<IUploadResponse>(req)
      .subscribe({
        next: (response: HttpResponse<IUploadResponse>) => {
          if (response.body) {
            action();
            this._router.navigate([this._importSettings.importInfoRoute],
                { queryParams: { uploadResponse: JSON.stringify(response.body) } });
          }
        },
      });
  }

  private _setImportSettings(importType: ImportType): void {

    const baseEntityUrl = this._getBaseEntityUrl(importType);
    const entityNames = `${importType}s`;
    this._importSettings = new ImportSettings({
      baseImportUrl: baseEntityUrl,
      uploadUrl: `${baseEntityUrl}/UploadFile`,
      startImportUrl : `${baseEntityUrl}/StartImport`,
      entityName: importType,
      entityNames: entityNames,
      filename  : `${entityNames}.csv`,
      sourceUrl: `/assets/${entityNames}.csv`,
      pictureType: this._getPictureType(importType),
      baseRoute: entityNames,
      importInfoRoute: `/${entityNames}/import/info`,
    });
  }

  private _getBaseEntityUrl(importType: ImportType): string {
    const app = this._settings.environment.application;
    switch (app) {
      case Application.AGENT_OFFICE:
      case Application.BACK_OFFICE:
        return importType === ImportType.user ? 'H21AgentImport' : 'H21TravelerImport';
      case Application.ADMIN_OFFICE:
        return 'H21UserImport';
    }
  }

  private _isCsv(filename: string): boolean {
    const ext = filename.split('.').pop();
    return ext === 'csv';
  }

  private _getPictureType(importType: ImportType) {
    switch (importType) {
      case ImportType.user: return PictureType.userImport;
      case ImportType.traveller: return PictureType.travelerImport;
    }
  }

}

import { MatDialog } from '@angular/material/dialog';
import { Inject, Injectable } from '@angular/core';

// interfaces
import { ICoreEnvironment } from '../../interfaces/core-environment.interface';

// models
import { CompanyProfileSetting } from '../../lib/h21-company-profile/company-profile-setting.model';

// components
import { H21TermsForUseDialogComponent } from '../../lib/h21-terms-for-use-dialog/h21-terms-for-use-dialog.component';

// tokens
import { CORE_ENVIRONMENT } from '../../lib/h21-company-list/core-environment.token';

// enums
import { Application } from '../../enums/application.enum';

@Injectable()
export class H21TermsForUseService {

  constructor(
    private _dialog: MatDialog,
    @Inject(CORE_ENVIRONMENT) private _core: ICoreEnvironment,
  ) { }

  public openAgreementAccept(setting: CompanyProfileSetting): void {
    if (this._correctSettingForAgreement(setting) && this._isApplicationForAgreement()) {
      const dialogConfig = {
        disableClose: true,
        autoFocus: false,
        width: '700px',
        height: '600px',
        backdropClass: 'h21-dialog_dark-backdrop',
        panelClass: 'h21-dialog_panel',
      };

      setTimeout(() => {
        this._dialog.open(H21TermsForUseDialogComponent, dialogConfig);
      }, 1000);
    }
  }

  private _correctSettingForAgreement(setting: CompanyProfileSetting): boolean {
    return setting && setting.isAgreementAccept === false;
  }

  private _isApplicationForAgreement(): boolean {
    return [
      Application.AGENT_OFFICE,
      Application.SEARCH_AND_BOOK,
    ].includes(this._core.application);
  }

}

import { OverlayRef } from '@angular/cdk/overlay';
import { PanelAction } from '../../../../../enums/panel-action.enum';
import { ViewMode } from '../../../../../enums/view-mode.enum';

export class CompanyReferenceDialogData {

  public referenceId: number;
  public companyProfileId: number;
  public mode: ViewMode;
  public overlay: OverlayRef;
  public action: PanelAction;

  constructor(obj?: Partial<CompanyReferenceDialogData>) {
    Object.assign(this, obj);
  }

}

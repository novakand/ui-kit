import { OverlayRef } from '@angular/cdk/overlay';

import { PanelAction } from '../../../../../enums/panel-action.enum';
import { ViewMode } from '../../../../../enums/view-mode.enum';

export class DepartmentPanelData {

  public id: number;
  public companyId: number;
  public overlay: OverlayRef;
  public action: PanelAction;
  public mode: ViewMode;
  public typeId: number;

  constructor(obj?: Partial<DepartmentPanelData>) {
    Object.assign(this, obj);
  }

}

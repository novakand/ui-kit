import { OverlayRef } from '@angular/cdk/overlay';

import { PanelAction } from '../../../../enums/panel-action.enum';

export class UserPanelData {

  public isAdmin: boolean;
  public companyId: number;
  public overlay: OverlayRef;
  public action: PanelAction;

  constructor(obj?: Partial<UserPanelData>) {
    Object.assign(this, obj);
  }

}

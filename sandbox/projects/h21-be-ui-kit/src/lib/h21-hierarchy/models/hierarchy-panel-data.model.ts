import { OverlayRef } from '@angular/cdk/overlay';

import { ProfileLinkFilter } from '../../../models';
import { PanelAction } from '../../../enums';

export class HierarchyPanelData {

  public overlay: OverlayRef;
  public action: PanelAction;
  public filter: ProfileLinkFilter;

  constructor(obj?: Partial<HierarchyPanelData>) {
    Object.assign(this, obj);
  }

}

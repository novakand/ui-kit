import { OverlayRef } from '@angular/cdk/overlay';

// enums
import { PanelAction } from '../../enums';

// models
import { UserProfile } from '../../models';

export interface ILinkDialog {

  userProfile?: UserProfile;
  userProfileId?: number;
  userProfileLinkId?: number;
  companyProfileId?: number;
  companyTypeId?: number;

  action?: PanelAction;
  overlay?: OverlayRef;

}

import { OverlayRef } from '@angular/cdk/overlay';
import { UserProfile } from '../../models/user-profile.model';

export class RolesDialogData {

  public userProfile: UserProfile;
  public userProfileId?: number;
  public userProfileLinkId?: number;
  public companyProfileId?: number;

  public overlay: OverlayRef;

  constructor(obj?: Partial<RolesDialogData>) {
    Object.assign(this, obj);
  }

}

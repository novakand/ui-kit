import { ICompanyProfileLink } from './company-profile-link.interface';

export class UserProfileLink {

  public id?: number;
  public userProfileId?: number;
  public jobTitle: string;
  public roleIds?: number[];
  public companyProfileId?: number;
  public withoutPublish?: boolean;

  public companyProfile: ICompanyProfileLink;

  constructor(obj?: Partial<UserProfileLink>) {
    Object.assign(this, obj);
  }

}

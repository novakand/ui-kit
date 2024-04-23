import { CompanyProfileSetting } from '../../h21-company-profile/company-profile-setting.model';
import { ICompanyProfile } from '../../h21-company-list/interfaces/company-profile.interface';
import { IUserCardAction } from './i-user-card-action';
import { IUserCardUser } from './i-user-card-user';

export interface IUserCardData {
  user?: IUserCardUser;
  actions?: IUserCardAction[];
  profile?: ICompanyProfile;
  setting?: CompanyProfileSetting;
}

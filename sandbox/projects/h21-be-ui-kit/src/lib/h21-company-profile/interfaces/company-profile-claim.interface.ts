import { CompanyClaim } from '../../../models/company-claim.model';

export interface ICompanyProfileClaim {
  getCompanyClaim(): CompanyClaim;
  isAvailable(): boolean;
}

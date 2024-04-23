import { IFileInfo } from '../../../../../interfaces';

export interface IProfileProviderSetting {
  companyProfileId: number;
  abbreviation: string;
  logo: IFileInfo;
  companyProfileProviders: ICompanyProfileProvider[];
  name: string;
  description: string;
  id: number;
}

export interface ICompanyProfileProvider {
  companyProfileId: number;
  providerName: string;
  providerTypeId: number;
  isCustomize: boolean;
  id: number;
}

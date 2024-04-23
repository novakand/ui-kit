import { CompanyServiceType } from '../../h21-company-profile/components/services';
import { IFileInfo, IH21DateTime, INamedEntity } from '../../../interfaces';

export interface ICompanyProfile extends INamedEntity {
  parent?: INamedEntity;
  shortName?: string;
  typeId?: number;
  entityId?: number;
  countryCode?: string;
  phone?: string;
  fax?: string;
  email?: string;
  invoiceEmail?: string;
  voucherEmail?: string;
  homePage?: string;
  vatNumber?: string;
  registerNumber?: string;
  registrationNumber?: string;
  inn?: string;
  kpp?: string;
  ogrn?: string;
  iataTids?: string;
  licenseNumber?: string;
  entityState?: number;
  createDate?: IH21DateTime;
  createUserName?: string;
  updateDate?: IH21DateTime;
  updateUserName?: string;
  avatar?: IFileInfo;
  logoFileHash?: string;
  stateId?: number;
  profileId?: number;
  entityRefId?: number;
  versionNumber?: number;
  hasActualContract?: boolean;
  isAgentOffice?: boolean;
  isBookNonRefundable?: boolean;
  servicesActual?: CompanyServiceType[];
}

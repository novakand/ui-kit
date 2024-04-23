import { ICodeNamedEntity, IH21DateTime } from '../../../interfaces';

export interface ICompanyProfileList extends ICodeNamedEntity {
  parentId?: number;
  parentName?: string;
  shortName?: string;
  typeId?: number;
  typeName?: string;
  countryId?: number;
  countryCode?: string;
  countryName?: string;
  phone?: string;
  fax?: string;
  email?: string;
  homePage?: string;
  vatNumber?: string;
  registerNumber?: string;
  inn?: string;
  regNum?: string; // inn or registerNumber
  kpp?: string;
  ogrn?: string;
  licenseNumber?: string;
  entityState?: number;
  createDate?: IH21DateTime;
  createUserName?: string;
  updateDate?: IH21DateTime;
  updateUserName?: string;
  stateName?: string;
  versionNumber?: number;
  hasActualContract?: boolean;
}

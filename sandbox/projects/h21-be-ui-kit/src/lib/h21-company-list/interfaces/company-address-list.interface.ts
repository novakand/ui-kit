import { IEntity } from '../../../interfaces';

export interface ICompanyAddressList extends IEntity {
  companyId?: number;
  typeId?: number;
  typeName?: string;
  zip?: string;
  countryName?: number;
  cityName?: number;
  address?: string;
}

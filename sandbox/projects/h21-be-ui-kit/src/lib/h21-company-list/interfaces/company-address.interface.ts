import { IEntity } from '../../../interfaces';

export interface ICompanyAddress extends IEntity {
  companyId?: number;
  typeId?: number;
  zip?: string;
  countryCode?: string;
  cityCode?: string;
  address?: string;

  devIsReadonly?: boolean;
}

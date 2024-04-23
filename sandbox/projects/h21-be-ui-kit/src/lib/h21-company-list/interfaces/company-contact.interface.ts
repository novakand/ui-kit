import { IEntity } from '../../../interfaces';

export interface ICompanyContact extends IEntity {
  companyId?: number;
  companyShortName?: string;
  firstName?: string;
  lastName?: string;
  position?: string;
  phone?: string;
  email?: string;
  entityState?: number;
  createDate?: string;
  createUserName?: string;
  updateDate?: string;
  updateUserName?: string;
  id?: number;
}

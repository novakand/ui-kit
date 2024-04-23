import { IEntity } from '../../../interfaces';

export interface ICompanyNote extends IEntity {
  companyId?: number;
  note?: string;
  createUserName?: string;
  viewOnly?: boolean;
}

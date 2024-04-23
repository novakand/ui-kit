import { CompanyRole } from '../lib/h21-company-profile/enums';
import { Permission } from '../enums';

export interface IUserPermission {
  name: string;
  role: CompanyRole;
  access: Permission;
}

import { IEntity } from '../../interfaces';

export interface IUserRoleList extends IEntity {
  jobTitle?: string;
  userProfileId?: number;
  roleId?: number;
  companyProfileId?: number;
  companyShortName?: string;
  companyProfileRegistrationNumber?: string;
  companyProfileShortName?: string;

  roleNames?: string;
}

export interface IUserLinkFilter {
  userProfileId: number;
}

export interface IUserLink {
  userProfileId: number;
  linkType: number;
  value: number;
  name: string;
  id: number;
}

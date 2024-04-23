export interface IProfileLink {
  countryCode: string;
  email: string;
  id: number;
  parentId: number;
  phone: string;
  profileId: number;
  registerNumber: string;
  shortName: string;
  typeCode: string;
  typeId: number;
  hasChildren: boolean;
  children?: IProfileLink[];
  totalChildren: number;
}

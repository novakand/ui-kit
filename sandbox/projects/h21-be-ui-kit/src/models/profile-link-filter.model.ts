export class ProfileLinkFilter {

  public shortNameContains: string;
  public registrationNumberContains: string;
  public countryCode: string;
  public parentIdIsNull: boolean;
  public parentId: number;
  public profileId: number;
  public typeId: number;
  public typeCode: string;
  public hasChildren: true;
  public id: number;

  constructor(obj?: Partial<ProfileLinkFilter>) {
    Object.assign(this, obj);
  }

}

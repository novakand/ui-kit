export class ProfileProviderFilter {

  public companyProfileId: number;
  public id: number;

  constructor(obj: Partial<ProfileProviderFilter>) {
    Object.assign(this, obj);
  }

}

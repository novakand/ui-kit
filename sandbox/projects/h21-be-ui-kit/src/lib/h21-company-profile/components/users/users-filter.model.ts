export class UsersFilter {

  public userProfileId: number;
  public roleId: number;
  public companyProfileId: number;
  public createDate: string;
  public createUserName: string;
  public updateDate: string;
  public updateUserName: string;
  public entityState: 0;
  public email: string;
  public emailContains: string;
  public id: 0;

  constructor(obj?: Partial<UsersFilter>) {
    Object.assign(this, obj);
  }

}

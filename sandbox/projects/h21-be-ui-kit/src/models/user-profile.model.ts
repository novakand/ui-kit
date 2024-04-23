import { IFileInfo } from '../interfaces';

export class UserProfile {

  public id: number;
  public code: string;
  public createUserName: string;
  public createDate: Date;
  public updateDate: Date;
  public countryCode: string;
  public cityCode: string;
  public firstName: string;
  public lastName: string;
  public middleName: string;
  public phone: string;
  public email: string;
  public h21Password: string;
  public stateId: number;
  public h21UserId: number;
  public timeZoneId: number;
  public avatar: IFileInfo;
  public avatarFileHash: string;
  public entityRefId: number;
  public identityUserId: string;
  public isEmailConfirmed: boolean;
  public birthDate: string;

}

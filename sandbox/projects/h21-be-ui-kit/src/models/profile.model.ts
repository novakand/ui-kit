import { IIdentityClaims } from '../interfaces/identity-claims.interface';

export class Profile {

  public registrationDate: Date;
  public updateDate: Date;
  public identityUserId: string;
  public pictureUrl: string;
  public picture: string;
  public firstName: string;
  public lastName: string;
  public middleName: string;
  public companyName: string[];
  public function: string[];
  public email: string;
  public phone: string;

  constructor(claims: IIdentityClaims) {
    this.registrationDate = claims.registration_date;
    this.updateDate = claims.update_date;
    this.identityUserId = claims.sub;
    this.pictureUrl = claims.picture_url;
    this.picture = claims.picture;
    this.firstName = claims.given_name;
    this.lastName = claims.family_name;
    this.middleName = claims.middle_name;
    this.companyName = claims.company_name;
    this.function = claims.function;
    this.email = claims.email;
    this.phone = claims.phone_number;
  }

}

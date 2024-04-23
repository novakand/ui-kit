import { Application } from '../../enums';

export class ProfileName {

  public id: number;
  public name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

}

export class CompanyProfileSetting {

  public id: number;
  public backofficeRoles: string[];
  public agentofficeRoles: string[];
  public isAgreementAccept: boolean;
  public backofficeCompanyProfileId: number;
  public agentofficeCompanyProfileId: number;

  constructor(obj: Partial<CompanyProfileSetting>) {
    Object.assign(this, obj);
  }

  public getCompanyProfileId(app: Application): number {
    if (Application.BACK_OFFICE === app) {
      return this.backofficeCompanyProfileId;
    }
    return this.agentofficeCompanyProfileId;
  }

}

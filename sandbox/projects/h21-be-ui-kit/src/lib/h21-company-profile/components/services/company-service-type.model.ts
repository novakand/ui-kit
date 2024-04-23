export class CompanyServiceType {

  public companyProfileId: number;
  public serviceTypeId: number;
  public id: number;

  constructor(obj: Partial<CompanyServiceType>) {
    (<any>Object).assign(this, obj);
  }

}

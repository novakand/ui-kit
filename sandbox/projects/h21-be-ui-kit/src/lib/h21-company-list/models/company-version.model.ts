// interfaces
import { ICompanyProfileList } from '../interfaces';
import { IH21DateTime } from '../../../interfaces';

// enums
import { EntityState } from '../../../enums';

export class CompanyVersion {

  public versionNumber: number;
  public createDate: IH21DateTime;
  public companyId: number;
  public state: EntityState;

  constructor(company: ICompanyProfileList) {
    if (company) {
      this.companyId = company.id;
      this.state = EntityState[EntityState[company.entityState]];
      this.versionNumber = company.versionNumber;
      this.createDate = company.createDate;
    }
  }

}

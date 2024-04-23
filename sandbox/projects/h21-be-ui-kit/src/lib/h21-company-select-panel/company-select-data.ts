import { ICompanyProfile } from '../h21-company-list/interfaces';

export class CompanySelectData {

  public ids: number[];
  public isChanged: boolean;
  public selected: ICompanyProfile;

  constructor(props?: Partial<CompanySelectData>) {
    Object.assign(this, props);
  }

}

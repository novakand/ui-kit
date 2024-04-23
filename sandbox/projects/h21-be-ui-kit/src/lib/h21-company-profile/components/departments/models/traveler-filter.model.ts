import { ICompanyDetails } from '../../../interfaces';

export class TravelerFilter {

  public registryNumberContains: string;
  public nameContains: string;
  public stateIdIn: number[];
  public birthDate: string;
  public nationalityCode: string;
  public jobTitle: string;
  public medicalDetails: string;
  public emailContains: string;
  public phoneContains: string;
  public companyIn: ICompanyDetails[];
  public id: number;
  public companyProfileId: number;

  constructor(obj?: Partial<TravelerFilter>) {
    Object.assign(this, obj);
  }

}

import { INamedEntity } from '../../../interfaces';

export class CompanyActualContract implements INamedEntity {

  public id: number;
  public name: string;
  public hasActualContract: boolean;

  constructor(obj?: Partial<CompanyActualContract>) {
    Object.assign(this, obj);
  }

}

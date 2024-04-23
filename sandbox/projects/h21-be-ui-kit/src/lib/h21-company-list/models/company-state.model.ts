import { ICodeNamedEntity } from '../../../interfaces';

export class CompanyState implements ICodeNamedEntity {

  public id: number;
  public name: string;
  public code: string;
  public description: string;

  constructor(obj?: Partial<CompanyState>) {
    Object.assign(this, obj);
  }

}

import { Application } from '../../../../enums';

export class CompanyFilter {

  public idIn: number[];
  public typeIdIn: number[];
  public countryId: number;
  public countryIdIn: number[];
  public countryCode: string;
  public innExpr: string;
  public searchExpr: string;
  public nameContains: string;
  public shortNameContains: string;
  public createDateGreaterEqual: Date;
  public createDateLessEqual: Date;
  public updateDateGreaterEqual: Date;
  public updateDateLessEqual: Date;
  public entityStateIn: number[];
  public isAllEntityState: boolean;
  public entityId: number;
  public id: number;
  public idNotEqual: number;
  public hasActualContract: boolean;
  public stateIdIn: number[];
  public application: Application;

  constructor(obj?: Partial<CompanyFilter>) {
    Object.assign(this, obj);
  }

}

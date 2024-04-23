export class DepartmentFilter {

  public companyProfileId: number;
  public createDate: string;
  public updateDate: string;
  public entityState: number;
  public name: string;
  public description: string;
  public id: number;

  constructor(obj?: Partial<DepartmentFilter>) {
    Object.assign(this, obj);
  }

}

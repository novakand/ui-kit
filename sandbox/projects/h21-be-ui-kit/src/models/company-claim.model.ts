export class CompanyClaim {

  public id: number;
  public role: string;

  constructor(obj: Partial<CompanyClaim>) {
    Object.assign(this, obj);
  }

}

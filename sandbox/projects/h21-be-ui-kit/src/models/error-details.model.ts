export class ErrorDetails {

  public text: string;
  public title: string;
  public errorCode: number;

  constructor(data?: Partial<ErrorDetails>) {
    (<any>Object).assign(this, data);
  }

}

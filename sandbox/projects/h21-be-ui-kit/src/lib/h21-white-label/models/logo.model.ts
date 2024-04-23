export class Logo {

  public fileUrl: string;
  public fileName: string;
  public fileHash: string;

  constructor(logo?: Partial<Logo>) {
    (<any>Object).assign(this, logo);
  }

}

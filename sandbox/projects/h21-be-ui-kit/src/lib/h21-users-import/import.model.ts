export class Import {

  public fileHash: string;
  public connectionId: string;
  public applicationType: number;

  constructor(obj: Partial<Import>) {
    Object.assign(this, obj);
  }

}

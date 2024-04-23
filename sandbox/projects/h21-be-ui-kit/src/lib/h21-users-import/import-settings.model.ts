import { PictureType } from '../h21-picture-lib';

export class ImportSettings {

  public filename: string;
  public sourceUrl: string;
  public pictureType: PictureType;
  public uploadUrl: string;
  public startImportUrl: string;
  public baseImportUrl: string;
  public entityName: string;
  public entityNames: string;
  public baseRoute: string;
  public importInfoRoute: string;

  constructor(importSettings?: Partial<ImportSettings>) {
    (<any>Object).assign(this, importSettings);
  }

}

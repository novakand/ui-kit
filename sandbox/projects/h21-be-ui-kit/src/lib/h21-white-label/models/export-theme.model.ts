import { Theme } from './theme.model';

export class ExportTheme {

  public id: number;
  public theme: Theme;
  public name: string;
  public userId: number;
  public domain: string;
  public description: string;

  constructor(theme?: Partial<ExportTheme>) {
    (<any>Object).assign(this, theme);
  }

}

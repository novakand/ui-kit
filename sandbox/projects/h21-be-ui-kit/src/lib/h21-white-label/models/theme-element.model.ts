export class ThemeElement {

  public id: number;
  public name: string;
  public themeId?: number;
  public property: string;
  public colorHexCode: string;
  public colorRgbCode: string;
  public contrastHexCode?: string;
  public contrastRgbCode?: string;

  constructor(theme?: Partial<ThemeElement>) {
    (<any>Object).assign(this, theme);
  }

}

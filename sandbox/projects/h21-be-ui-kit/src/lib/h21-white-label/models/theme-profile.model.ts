export class ThemeProfile {

  public userId: number;
  public enabled: true;
  public domain: string;
  public themeId: number;
  public name: string;
  public description: string;
  public id: number;

  constructor(obj?: Partial<ThemeProfile>) {
    (<any>Object).assign(this, obj);
  }

}

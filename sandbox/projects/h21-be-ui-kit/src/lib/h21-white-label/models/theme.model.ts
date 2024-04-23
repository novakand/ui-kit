import { ThemeElement } from './theme-element.model';
import { Logo } from './logo.model';

export class Theme {

  public id: number;
  public logo: Logo;
  public name: string;
  public isDark: boolean;
  public isDefault: boolean;
  public logoFileUrl: string;
  public logoFileName: string;
  public logoFileHash: string;
  public buttonBorderRadius = 4;
  public elements: ThemeElement[];

  constructor(theme?: Partial<Theme>) {
    (<any>Object).assign(this, theme);
  }

}

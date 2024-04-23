import { INamedEntity } from '../../../interfaces/named-entity.interface';
import { IPublishTheme } from './publish-theme.interface';

export interface IPublishThemeProfile extends INamedEntity {
  userId: number;
  enabled: boolean;
  domain: string;
  publishTheme: IPublishTheme;
  supportContent: string;
  themeId: number;
  name: string;
  description: string;
  id: number;
}

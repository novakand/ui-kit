import { INamedEntity } from '../../../interfaces/named-entity.interface';
import { IFileInfo } from '../../../interfaces/file-info.interface';


export interface IWhitelabelItem extends INamedEntity {
  id?: number;
  userName?: string;
  themeId?: number;
  themeName?: string;
  themeIsDefault?: boolean;
  enabled?: boolean;
  domain?: string;
  description?: string;
  name?: string;
  logo?: IFileInfo;
  checked?: boolean;
  logoFileHash?: string;
  themeLogoFileHash?: string;
  logoFileUrl?: string;
  supportContent?: string;
}

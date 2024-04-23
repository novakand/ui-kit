import { INamedEntity } from '../../../interfaces/named-entity.interface';

export interface IThemeItem extends INamedEntity {
  id?: number;
  description?: string;
  name?: string;
  isDefault?: boolean;
  logoFileHash?: string;
  logoFileUrl?: string;
}

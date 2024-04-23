import { INamedEntity } from './named-entity.interface';
import { IH21DateTime } from './h21-date-time.interface';

export interface IEntityHistory extends INamedEntity {
  createUserName?: string;
  createDate?: IH21DateTime;
}

import { IUserCardAction } from './i-user-card-action';
import { IUserCardUser } from './i-user-card-user';

export interface IUserCardData {
  user?: IUserCardUser;
  actions?: IUserCardAction[];
}

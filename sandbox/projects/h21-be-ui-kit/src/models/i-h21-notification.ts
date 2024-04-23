import { IH21DateTime } from '../interfaces/h21-date-time.interface';

export interface IH21Notification {
  text?: string;
  icon?: string;
  createDate?: IH21DateTime;
  isUnread?: boolean;
  dateTimeSplitter?: string;
}

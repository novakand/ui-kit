import { IconType } from '../enums/icon-type';
import { AlertType } from '../enums/alert-type';

export interface IDialogOption {
  title: string;
  content: string;
  iconType?: IconType;
  alertType?: AlertType;
  closeText?: string;
}

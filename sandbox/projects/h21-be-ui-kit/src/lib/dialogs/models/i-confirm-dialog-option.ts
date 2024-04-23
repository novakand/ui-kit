import { IDialogOption } from './i-dialog-option';

export interface IConfirmDialogOption extends IDialogOption {
  isCancelled: boolean;
}

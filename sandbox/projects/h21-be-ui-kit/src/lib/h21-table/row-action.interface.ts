import { RowAction } from './row-action.enum';

export interface IRowAction<T> {
  action: RowAction;
  data: T;
}

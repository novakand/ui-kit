import { ActionType } from './action-type.enum';

export class ActionInfo {

  public value: number;
  public type: ActionType;

  constructor(obj: Partial<ActionInfo>) {
    Object.assign(this, obj);
  }

}

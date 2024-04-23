import { ICodeNamedEntity } from './code-named-entity.interface';

export interface IState extends ICodeNamedEntity {
  groupCode? : string;
  stateMachineId?: number;
}

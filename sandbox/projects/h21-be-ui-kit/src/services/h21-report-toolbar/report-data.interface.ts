import { INamedEntity } from '../../interfaces/named-entity.interface';

export interface IReportData extends INamedEntity {
  externalId: string;
  jsonParameter?: string;
}

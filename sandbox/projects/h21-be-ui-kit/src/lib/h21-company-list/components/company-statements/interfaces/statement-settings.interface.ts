import { StatementDownloadType } from '../enums/statement-download-type.enum';

export interface IStatementSettings {
  id: number;
  downloadType: StatementDownloadType;
  emails: string[];
}

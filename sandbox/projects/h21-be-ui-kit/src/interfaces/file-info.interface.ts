import { ICodeNamedEntity } from './code-named-entity.interface';

export interface IFileInfo extends ICodeNamedEntity {
  fileName?: string;
  fileHash?: string;
  fileSize?: number;
  fileUrl?: string;
  fileStorageId?: number;
  folderId?: number;
}

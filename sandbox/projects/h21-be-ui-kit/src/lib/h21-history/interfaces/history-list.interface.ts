import { IEntity } from '../../../interfaces/entity.interface';
import { IHistoryDetail } from './history-detail.interface';

export interface IHistoryList extends IEntity {
    createDate?: Date;
    action?: string;
    createUserName?: string;
    expandData?: IHistoryDetail[];
}

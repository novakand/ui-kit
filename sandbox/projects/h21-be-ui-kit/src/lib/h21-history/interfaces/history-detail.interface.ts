export interface IHistoryDetail {
  name?: string;
  oldValue?: string;
  newValue?: string;
  childs?: IHistoryDetail[];
}

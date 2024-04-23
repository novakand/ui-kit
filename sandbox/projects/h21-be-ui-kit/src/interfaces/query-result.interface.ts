export interface IQueryResult<TEntity> {
  items?: TEntity[];
  filter?: any;
  count?: number;
}

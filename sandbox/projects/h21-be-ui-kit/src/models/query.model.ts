import { IOrder } from '../interfaces/order.interface';

export class QueryBase {

  public take?: number;
  public skip?: number;
  public order?: IOrder[];
  public withCount = true;

  constructor(obj?: Partial<QueryBase>) {
    (<any>Object).assign(this, obj);
  }

}

export class Query<TFilter> extends QueryBase {

  public filter?: TFilter;

  constructor(obj: Partial<Query<any>>) {
    super();
    (<any>Object).assign(this, obj);
  }

}

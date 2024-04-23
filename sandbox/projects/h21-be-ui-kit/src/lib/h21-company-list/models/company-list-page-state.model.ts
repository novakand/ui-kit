import { CompanyFilter } from '../components/company-filter';
import { IOrder } from '../../../interfaces';

export class CompanyListPageState {

  constructor(
    public companyFilter: CompanyFilter,
    public pageIndex = 0,
    public pageSize = 10,
    public order: IOrder = { field: 'createDate', desc: true },
  ) {}

}

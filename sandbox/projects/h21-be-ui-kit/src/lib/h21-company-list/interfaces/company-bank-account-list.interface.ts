import { IEntity } from '../../../interfaces/entity.interface';

export interface ICompanyBankAccountList extends IEntity {
  companyId?: number;
  paymentTypeId?: number;
  // payment method
  paymentTypeName?: string;
  // name
  cardName?: string;
  recipientBankName?: string;
  // number
  cardNumber?: string;
  accountNumber?: string;
  accountCurrencyCurrencyCode?: string;
  // status
  stateName?: string;

  isActive?: boolean;
  isDefault?: boolean;
  isHideCardDetail?: boolean;
}

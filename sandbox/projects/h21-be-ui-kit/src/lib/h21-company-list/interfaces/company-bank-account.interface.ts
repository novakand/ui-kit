import { IPaymentReference } from './payment-reference.interface';
import { IEntity } from '../../../interfaces/entity.interface';

export interface ICompanyBankAccount extends IEntity {
  companyId?: number;
  recipientBankAddress?: string;
  recipientBankName?: string;
  recipientBankSwift?: string;
  recipientBic?: string;
  recipientAbaCode?: string;
  recipientSortCode?: string;
  accountNumber?: string;
  accountCurrencyCurrencyCode?: string;

  correspondentBankName?: string;
  correspondentBankSwift?: string;
  correspondentBic?: string;
  correspondentAbaCode?: string;
  correspondentSortCode?: string;
  correspondentAccount?: string;
  correspondentAccountCurrencyCurrencyCode?: string;

  expiryDate?: Date;
  cardName?: string;
  cardNumber?: string;
  paymentTypeId?: number;
  stateId?: number;
  isDefault?: boolean;
  isHideCardDetail?: boolean;
  costModeId?: number;

  referencesActual?: IPaymentReference[];
}

import { ICompanyBankAccountList } from '../interfaces/company-bank-account-list.interface';
import { IEntity } from '../../../interfaces/entity.interface';

// utils
import { H21StringUtils } from '../../../services/h21-string.utils';
import { PaymentTypeId } from '../../../enums/payment-type-id.enum';

// enums

export class PaymentMethod implements IEntity {

  public id?: number;
  public companyId: number;
  public paymentTypeId: number;

  public paymentMethod: string;
  public name: string;
  public number: string;
  public isActive?: boolean;
  public isDefault?: boolean;

  constructor(obj: ICompanyBankAccountList) {
    if (!!obj) {
      this.id = obj.id;
      this.companyId = obj.companyId;
      this.isActive = obj.isActive;
      this.isDefault = obj.isDefault;
      this.paymentTypeId = obj.paymentTypeId;
      this.paymentMethod = obj.paymentTypeName;

      switch (obj.paymentTypeId) {
        case PaymentTypeId.bankTransfer:
          this.name = obj.recipientBankName;
          this.number = `${H21StringUtils.getNumber(obj.accountNumber, obj.isHideCardDetail)} ${obj.accountCurrencyCurrencyCode}`;
          break;
        case PaymentTypeId.bta:
        case PaymentTypeId.creditCards:
        case PaymentTypeId.airPlus:
          this.name = obj.cardName;
          this.number = H21StringUtils.getNumber(obj.cardNumber, obj.isHideCardDetail);
          break;
      }
    }
  }

}

import { CompanyServiceType } from '../components/services';
import { IFileInfo } from '../../../interfaces';

export interface ICompany {
  type: string;
  inn: string;
  createDate: string;
  changeDate: string;
  legalName: string;
  companyName: string;
  description: string;
  email: string;
  defaultPage: string;
  invoiceEmail: string;
  voucherEmail: string;
  countryId: number;
  logo: IFileInfo;
  phone: string;
  fax: string;
  kpp: string;
  website: string;
  ogrn: string;
  entityRefId: number;
  licenseNumber: string;
  registerNumber: string;
  vatNumber: string;
  id: number;
  countryCode: string;
  typeId: number;
  updateDate: string;
  name: string;
  shortName: string;
  servicesActual: CompanyServiceType[];
  isSendInvoiceToUserAir: boolean;
  isSendInvoiceToUserHotel: boolean;
  isSendInvoiceToUserTrain: boolean;
  isSendInvoiceToUserTransfer: boolean;

  isBookNonRefundable: boolean;
  isPostPayment: boolean;
  isBookingFeePercent: boolean;
  bookingFee: number;

  readRules: ICompanyProfileReadRules;
}

export interface ICompanyProfileReadRules {
  isReadOnlyOtherSettings: boolean;
  isReadOnlyBookNonRefundable: boolean;
  isReadOnlyPostPayment: boolean;
  isReadOnlyBookingFeePercent: boolean;
  isReadOnlyBookingFee: boolean;
  isReadOnlyServices : boolean;
}

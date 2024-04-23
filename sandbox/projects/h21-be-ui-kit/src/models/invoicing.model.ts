export interface InvoiceItem {
  label: string;
  field: string;
}

export const invoicing: InvoiceItem[] = [
  {
    label: 'Air',
    field: 'isSendInvoiceToUserAir',
  },
  {
    label: 'Hotels',
    field: 'isSendInvoiceToUserHotel',
  },
  {
    label: 'Transfer',
    field: 'isSendInvoiceToUserTransfer',
  },
  {
    label: 'Train',
    field: 'isSendInvoiceToUserTrain',
  },
];

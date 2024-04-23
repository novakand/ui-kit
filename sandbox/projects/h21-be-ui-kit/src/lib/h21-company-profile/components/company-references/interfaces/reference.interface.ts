export interface IReference {
  id: number;
  name: string;
  enable: boolean;
  mandatory: boolean;
  companyProfileId: number;
  isIncludeForAnonymousTraveler: boolean;
  isShowInIndividualInvoice: boolean;
  isShowInMyBookings: boolean;
  valuesActual: IReferenceValue[];
  editable: boolean;
}

export interface IReferenceValue {
  companyReferenceId: number;
  value: string;
  id: number;
}

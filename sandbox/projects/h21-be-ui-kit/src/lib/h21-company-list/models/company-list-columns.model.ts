import { IColumn } from '../../../interfaces';

export const COLUMNS: IColumn[] = [
  { caption: 'Company name', name: 'name', required: false, default: true, displayed: true },
  { caption: 'Legal name', name: 'legalName', required: false, default: false, displayed: false },
  { caption: 'Company type', name: 'typeName', required: false, default: true, displayed: true },
  { caption: 'Country', name: 'countryName', required: false, default: true, displayed: true },
  { caption: 'Reg Num | INN', name: 'regNum', required: false, default: true, displayed: true },
  { caption: 'Status', name: 'stateName', required: false, default: true, displayed: true },
  { caption: 'State', name: 'hasActualContract', required: false, default: false, displayed: false },
  { caption: 'Create user', name: 'createUserName', required: false, default: false, displayed: false },
  { caption: 'Date of creation', name: 'createDate', required: false, default: true, displayed: true },
  { caption: 'Date of the last change', name: 'updateDate', required: false, default: true, displayed: true },
];

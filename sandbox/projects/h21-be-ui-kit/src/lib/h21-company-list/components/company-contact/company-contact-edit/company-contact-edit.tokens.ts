import { InjectionToken } from '@angular/core';

import { ICompanyContact } from '../../../interfaces';

export const COMPANY_CONTACT_DIALOG_DATA = new InjectionToken<ICompanyContact>('COMPANY_CONTACT_DIALOG_DATA');

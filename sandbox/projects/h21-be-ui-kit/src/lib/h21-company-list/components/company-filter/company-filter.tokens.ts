import { InjectionToken } from '@angular/core';

import { CompanyFilter } from './company-filter.model';

export const FILTER_DIALOG_DATA = new InjectionToken<CompanyFilter>('FILTER_DIALOG_DATA');

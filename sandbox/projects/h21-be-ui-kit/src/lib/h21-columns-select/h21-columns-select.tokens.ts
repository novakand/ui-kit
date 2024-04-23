import { InjectionToken } from '@angular/core';

import { IH21Column } from '../h21-table/h21-column.interfaces';

export const COLUMNS_DATA = new InjectionToken<IH21Column[]>('COLUMNS_DATA');

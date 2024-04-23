import { InjectionToken } from '@angular/core';

import { IH21Notification } from '../../../models';

export const DIALOG_DATA = new InjectionToken<IH21Notification[]>('DIALOG_DATA');

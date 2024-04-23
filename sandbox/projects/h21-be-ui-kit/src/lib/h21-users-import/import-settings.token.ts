import { InjectionToken } from '@angular/core';
import { ImportType } from './import-type.enum';

export const IMPORT_SETTINGS  = new InjectionToken<ImportType>('IMPORT_SETTINGS');

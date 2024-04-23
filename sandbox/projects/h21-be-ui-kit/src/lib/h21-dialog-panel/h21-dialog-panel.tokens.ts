import { ComponentType } from '@angular/cdk/portal';
import { InjectionToken } from '@angular/core';

export const DIALOG_PANEL_COMPONENT = new InjectionToken<ComponentType<any>>('DIALOG_PANEL_COMPONENT');
export const DIALOG_PANEL_DATA = new InjectionToken<any>('DIALOG_PANEL_DATA');

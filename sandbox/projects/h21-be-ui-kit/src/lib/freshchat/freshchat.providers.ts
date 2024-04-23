import { InjectionToken } from '@angular/core';

import { IFreshChatInitOptions } from './freshchat.interfaces';

export const FRESHCHAT_INIT_OPTIONS = new InjectionToken<IFreshChatInitOptions>('freshchat-init-options');

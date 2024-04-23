import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { IFreshChatInitOptions } from './freshchat.interfaces';
import { FRESHCHAT_INIT_OPTIONS } from './freshchat.providers';
import { LoaderService } from '../../services/loader.service';
import { FreshChatService } from './freshchat.service';

@NgModule({
  imports: [
    CommonModule,
  ],
})
export class FreshChatModule {

  public static forRoot(initOptions: IFreshChatInitOptions): ModuleWithProviders {
    return {
      ngModule: FreshChatModule,
      providers: [
        LoaderService,
        FreshChatService,
        { provide: FRESHCHAT_INIT_OPTIONS, useValue: initOptions },
      ],
    };
  }

}

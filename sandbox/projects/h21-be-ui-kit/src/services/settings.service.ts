import { Injectable } from '@angular/core';

import { ICoreEnvironment } from '../interfaces/core-environment.interface';

@Injectable()
export class SettingsService {

  public environment: ICoreEnvironment;

  //noinspection JSUnusedGlobalSymbols
  public setEnvironment(env: ICoreEnvironment) {
    this.environment = env;
  }

}

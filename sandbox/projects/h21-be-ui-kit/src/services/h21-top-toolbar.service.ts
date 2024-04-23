import { Injectable } from '@angular/core';

import { IToolbarActionButton } from '../lib/h21-top-toolbar/models';

@Injectable({
  providedIn: 'root',
})
export class H21TopToolbarService {

  public actions: IToolbarActionButton[] = [];

}

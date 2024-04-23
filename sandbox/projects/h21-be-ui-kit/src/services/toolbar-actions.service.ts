import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

// models
import { IToolbarActionButton } from '../lib/h21-top-toolbar/models';

@Injectable({
  providedIn: 'root',
})
export class ToolbarActionsService {

  public actions$ = new BehaviorSubject<IToolbarActionButton[]>([]);

}

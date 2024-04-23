import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export abstract class BaseDisposableService implements OnDestroy {

  private _subscribes: Subscription[] = [];

  public ngOnDestroy(): void {
    if (this._subscribes) {
      this._subscribes
        .filter((f) => !f.closed)
        .forEach((x) => x.unsubscribe());
    }
  }

  public pushSubscription(subscription: Subscription) {
    if (this._subscribes) {
      this._subscribes.push(subscription);
    }
  }

}

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Observable, of } from 'rxjs';

@Component({
  selector: 'h21-card-loader',
  templateUrl: './card-loader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardLoaderComponent {

  public counts$: Observable<number[]> = of([1, 2, 3, 4]);

  public trackByFn(index: number): number {
    return index;
  }

}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Observable, of } from 'rxjs';

@Component({
  selector: 'h21-card-list-loader',
  templateUrl: './h21-card-list-loader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class H21CardListLoaderComponent {

  @Input() public showNoResult = false;
  @Input() public noResultText = 'Nothing found';

  public counts$: Observable<number[]> = of([1, 2, 3, 4]);

  public trackByFn(index: number): number {
    return index;
  }

}

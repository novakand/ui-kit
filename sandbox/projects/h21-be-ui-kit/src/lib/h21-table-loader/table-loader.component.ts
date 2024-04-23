import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Observable, of } from 'rxjs';

@Component({
  selector: 'h21-table-loader',
  templateUrl: './table-loader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableLoaderComponent {

  @Input() public showNoResult = false;
  @Input() public noResultText = 'Nothing found';

  public counts$: Observable<number[]> = of([1, 2, 3, 4, 5, 6, 7, 8]);

  public trackByFn(index: number): number {
    return index;
  }

}

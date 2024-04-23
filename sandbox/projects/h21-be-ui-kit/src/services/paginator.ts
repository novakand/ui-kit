import { MatPaginator } from '@angular/material';

export class Paginator {

  public static calcCurrentPage(paginator: MatPaginator, totalCount: number): void {
    const count = paginator.pageIndex * paginator.pageSize;
    if (totalCount - 1 <= count) {
      paginator.previousPage();
    }
  }

}

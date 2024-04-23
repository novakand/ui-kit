import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';

// animations
import { H21CustomTableAnimation } from '../../../../animations/h21-custom-table.animation';

// material
import { MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';

// rxjs
import { filter, map, toArray } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';
import { ViewMode } from '../../../../enums';

// interfaces
import { IH21Column, IH21Order } from '../../h21-column.interfaces';
import { IRowAction } from '../../row-action.interface';

// services
import { Paginator } from '../../../../services/paginator';

// enums
import { RowAction } from '../../row-action.enum';

@Component({
  selector: 'h21-table',
  templateUrl: './h21-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: H21CustomTableAnimation,
})
export class H21TableComponent implements OnChanges {

  @Input() public dataSource: MatTableDataSource<unknown>;
  @Input() public showLoader: boolean;
  @Input() public showNoData: boolean;
  @Input() public noDataText: string;
  @Input() public columns: IH21Column[];
  @Input() public totalCount: number;
  @Input() public pageSize: number;
  @Input() public order: IH21Order;
  @Input() public withCustomContent: boolean;
  @Input() public rowHover: boolean;
  @Input() public mode: ViewMode;

  @Output() public changePageEmit: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
  @Output() public rowEmit: EventEmitter<unknown> = new EventEmitter<unknown>();
  @Output() public sortEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() public actionEmit: EventEmitter<IRowAction<unknown>> = new EventEmitter<IRowAction<unknown>>();

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if (paginator) {
      this._paginator = paginator;
      this._paginator.pageSize = this.pageSize;
      this._paginator.pageIndex = this._pageIndex;
    }
  }

  @ContentChild('customCell') public customCell: TemplateRef<unknown>;

  public pageSizeCounts$: Observable<number[]> = of([10, 20, 50, 100]);
  public loadingTableRow$: Observable<number[]> = of([1, 2, 3, 4, 5, 5, 6, 8]);
  public displayedColumns$: Observable<string[]>;

  public viewMode = ViewMode.View;

  public _pageIndex: number;
  private _paginator: MatPaginator;

  public ngOnChanges(changes: SimpleChanges): void {
    this._setDisplayedColumns(changes);
    this._setPaginator(changes);
  }

  public trackByFn(index): void {
    return index;
  }

  public pageChange(event: PageEvent): void {
    Paginator.calcCurrentPage(this._paginator, this.totalCount);
    this._pageIndex = event.pageIndex;
    this.changePageEmit.emit(event);
  }

  public emitActionRow<T>(action: RowAction, data: T): void {
    this.actionEmit.emit({ action: action, data: data });
  }

  public sort(field: string): void {
    this.sortEmit.emit(field);
  }

  public rowClick<T>(row: T): void {
    const selection = window.getSelection();
    if (selection.toString().length === 0) {
      this.rowEmit.next(row);
    }
  }

  public needToWarn(action: string): boolean {
    return action != null && (action.indexOf('delete') >= 0 || action.indexOf('remove') >= 0);
  }

  private _setDisplayedColumns(changes: SimpleChanges): void {
    if (changes.columns && changes.columns.currentValue) {
      this.displayedColumns$ = from(this.columns)
        .pipe(
          filter((x) => x.displayed),
          map((v) => v.name),
          toArray(),
        );
    }
  }

  private _setPaginator(changes: SimpleChanges): void {
    if (changes.dataSource && changes.dataSource.currentValue) {
      this.dataSource.paginator = this.paginator;
    }
  }

}

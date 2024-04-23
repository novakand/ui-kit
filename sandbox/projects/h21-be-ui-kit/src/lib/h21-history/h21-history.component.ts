import { Component, EventEmitter, Inject, Input, OnDestroy, Optional, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';

import { IQueryResult } from '../../interfaces/query-result.interface';
import { IHistoryDetail, IHistoryList } from './interfaces';
import { Query } from '../../models';

import { HistoryExpandProgressVisibilityAniamtion } from '../../animations/h21-history';
import { SettingsService } from '../../services/settings.service';
import { Utils } from '../../services/utils';
import { LoadProgressService } from '../../services/load-progress.service';

import { BASE_URL } from './base-url.token';

@Component({
  selector: 'h21-history',
  templateUrl: './h21-history.component.html',
  providers: [DatePipe],
  animations: [
    HistoryExpandProgressVisibilityAniamtion,
  ],
})
export class H21HistoryComponent implements OnDestroy  {

  @Input()
  set entityRefId(value: number) {
    if (value !== this._entityRefId) {
      this._entityRefId = value;
      this.load();
    }
  }

  get entityRefId(): number {
    return this._entityRefId;
  }

  @Output()
  public dataLoaded: EventEmitter<IQueryResult<IHistoryList>> = new EventEmitter<IQueryResult<IHistoryList>>();

  public url = `${this._settings.environment.apiRootUrl}EntityHistory/`;

  public inProgress = true;
  public noProgress: boolean;

  public pageSize = 10;
  public pageIndex = 0;
  public totalCount: number;

  public displayedColumns: string[];
  public expandDisplayedColumns: string[];
  public expandChildDisplayedColumns: string[];

  public expandedElement: IHistoryList;
  public dataSource: MatTableDataSource<IHistoryList>;
  public expandedChildElement: IHistoryList;
  public expandInProgress = false;
  public expandInProgressDelayed = false;

  @ViewChild(MatPaginator) private _paginator: MatPaginator;

  private _entityRefId: number;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private _http: HttpClient,
              private _datePipe: DatePipe,
              private _settings: SettingsService,
              @Inject(BASE_URL) @Optional() baseUrl: string,
              private _loadProgressService: LoadProgressService,
  ) {
    baseUrl && (this.url = baseUrl);

    this.displayedColumns = [
      'expand',
      'createDate',
      'action',
      'createUserName',
    ];
    this.expandDisplayedColumns = [
      'expand',
      'blank',
      'name',
      'oldValue',
      'newValue',
    ];
    this.expandChildDisplayedColumns = [
      'blank',
      'name',
      'oldValue',
      'newValue',
    ];
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public load() {
    if (!this._entityRefId) {
      return;
    }

    const filter = new Query({
      withCount: true,
      take: this.pageSize,
      skip: this.pageSize * this.pageIndex,
      filter: { entityRefId: this._entityRefId },
      order: [
        {
          field: 'createDate',
          desc: true,
        },
      ],
    });

    this._loadProgressService.show(1);
    this.noProgress = false;

    this._http.post<IQueryResult<IHistoryList>>(`${this.url}PostQuery`, filter)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (data: IQueryResult<IHistoryList>) => {
          this.totalCount = data.count;
          const items = data.items.map((e: any) => {
            e.action = e.categoryName || e.name;
            return e;
          });
          this._setDS(items);
        },
      });
  }

  public pageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.load();
  }

  public expand(element: IHistoryList): void {
    this.expandedElement = element;

    if (!element || element.expandData) {
      return;
    }

    this.expandInProgress = true;
    this.expandInProgressDelayed = true;

    const body = {
      filter: {
        newId: element.id,
        entityRefId: this._entityRefId,
      },
    };

    this._http.post<IHistoryDetail[]>(`${this.url}PostDifference`, body)
      .subscribe({
        next: (e: IHistoryDetail[]) => {
          element.expandData = e || [];
          element.expandData.forEach((val) => { this._formatIfDate(val); });

          this.expandInProgress = false;
          setTimeout(() => { this.expandInProgressDelayed = false; }, 100);
        },
      });
  }

  private _formatIfDate(value: IHistoryDetail): void {
    if (value.name.includes('Date') || value.name === 'ActiveFrom') {
      let parsed = Utils.parseDate(value.oldValue);
      value.oldValue = this._datePipe.transform(parsed, 'MM.dd.yyyy HH:mm');
      parsed = Utils.parseDate(value.newValue);
      value.newValue = this._datePipe.transform(parsed, 'MM.dd.yyyy HH:mm');
    }
  }

  private _setDS(items: IHistoryList[]): void {
    if (this.dataSource) {
      this.dataSource.connect().next(items);
    } else {
      this.dataSource = new MatTableDataSource<IHistoryList>(items);
      this.dataSource.paginator = this._paginator;
    }

    if (!this.totalCount) {
      this._afterLoad();
    } else {
      this._updateUserName(items);
    }
  }

  private _updateUserName(historyList: IHistoryList[]): void {
    const url = `${this._settings.environment.profileApi}UserProfile/`;

    const filtered = historyList.filter((item) => item.createUserName);
    if (!filtered.length) {
      this._afterLoad();
      return;
    }

    const requests = filtered.map((history) => {
      return this._http.get(`${ url }GetUserNameByEmail?email=${ history.createUserName }`, { responseType: 'text' });
    });

    const zip = (a, b) => a.map((x, i) => [x, b[i]]);

    forkJoin(requests)
      .subscribe({
        next: (values) => {
          for (const [a, b] of zip(filtered, values)) {
            a.createUserName = b;
          }
          this.dataLoaded.emit(historyList);
          this._afterLoad();
        },
      });
  }

  private _afterLoad(): void {
    this._loadProgressService.hide(1);
    this.inProgress = false;
    this.noProgress = !this.totalCount;
  }

}

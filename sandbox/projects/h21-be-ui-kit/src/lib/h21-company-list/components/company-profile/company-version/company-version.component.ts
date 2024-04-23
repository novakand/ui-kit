import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// services
import { CompanyService } from '../../../services/company.service';

// models
import { Query } from '../../../../../models';
import { CompanyVersion } from '../../../models';

// enums
import { EntityState } from '../../../../../enums';

// interfaces
import { IOrder } from '../../../../../interfaces';

@Component({
  selector: 'h21-company-version',
  templateUrl: './company-version.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyVersionComponent implements OnInit, OnDestroy {

  @Input() public companyId: number;
  @Output() public selectedVersion = new Subject<CompanyVersion>();
  @Output() public oneVersion = new Subject<boolean>();

  public companyPublished$ = new Subject();
  public companyVersions: CompanyVersion[] = [];
  public selectedCompanyVersions: CompanyVersion;

  private _displayedStates: number[] = [
    EntityState.ACTUAL,
    EntityState.ACTUAL_VERSION,
    EntityState.VERSION,
  ];
  private _order: IOrder[] = [ { field: 'updateDate', desc: true, } ];
  private _destroy$ = new Subject<boolean>();

  constructor(private _companyService: CompanyService) { }

  public ngOnInit() {
    this._search();

    this.companyPublished$.asObservable()
      .pipe(takeUntil(this._destroy$))
      .subscribe({ next: () => this._search() });
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public trackByFn(index: number): number {
    return index;
  }

  public onChangeVersion(version: CompanyVersion) {
    this._setSelectedVersion(version);
  }

  public isCurrentVersion(state: EntityState) {
    return state === EntityState.ACTUAL;
  }

  private _setSelectedVersion(version: CompanyVersion) {
    this.selectedCompanyVersions = version;
    this.selectedVersion.next(version);
  }

  private _search() {
    const filter = new Query({
      filter: { entityId: this.companyId, entityStateIn: this._displayedStates, },
      order: this._order,
      withCount: true,
    });

    this._companyService.getVersionList(filter)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (versions) => {
          if (versions) {
            this.companyVersions = versions;
            this._setSelectedVersion(this.companyVersions.find((f) => f.companyId === this.companyId));

            const oneVersion = versions.length === 1 && versions[0].versionNumber === 1;
            this.oneVersion.next(oneVersion);
          }
        },
      });
  }

}

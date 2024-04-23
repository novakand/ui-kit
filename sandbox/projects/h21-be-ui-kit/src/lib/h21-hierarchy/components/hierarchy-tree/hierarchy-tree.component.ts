import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// services
import { SysadminVocabularyService } from '../../../../services/sysadmin-vocabulary.service';
import { ProfileLinkService } from '../../../../services/profile-link.service';

// models
import { ProfileLinkFilter, Query } from '../../../../models';

// interfaces
import { IProfileLink } from '../../../../interfaces';

// animations
import { HierarchyProgressVisibilityAnimation } from '../../../../animations/hierarchy-visibility';

@Component({
  selector: 'h21-hierarchy-tree',
  templateUrl: './hierarchy-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [HierarchyProgressVisibilityAnimation],
})
export class HierarchyTreeComponent implements OnDestroy, OnChanges {

  @Input() public dataSource: MatTableDataSource<IProfileLink>;
  @Input() public showHeaderRow = true;
  @Input() public level = 0;
  @Input() public maxLevel: number;
  @Input() public resetExpand: boolean;

  public expandedElement: IProfileLink;
  public expandedElements = [];
  public expandInProgressDelayed: boolean;
  public displayedColumns: string[] = ['shortName', 'registerNumber', 'countryName', 'phone', 'typeCode'];

  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private _router: Router,
              private _cdr: ChangeDetectorRef,
              private _service: ProfileLinkService,
              private _vocabulary: SysadminVocabularyService,
  ) {
    this.isShowTotalChildren() && (this.displayedColumns.splice(5, 0, 'totalChildren'));
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.resetExpand && changes.resetExpand.currentValue) {
      this.resetExpand = changes.resetExpand.currentValue;
      this.resetExpand && (this.expandedElements = []);
    }
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public isShowTotalChildren(): boolean {
    return !this._router.url.includes('company-profile');
  }

  public getCompanyTypeCssClassName(typeName: string): string {
    return typeName ? `h21-chip__company-${typeName.replace(' ', '-').toLowerCase()}` : '';
  }

  public companyType(id: number): string {
    return this._vocabulary.fieldById(this._vocabulary.companyType, id, 'name');
  }

  public expand(element: IProfileLink): void {
    this.expandedElements.push(element);
    this._getList(element);
  }

  public collapse(element: IProfileLink): void {
    this.expandedElements.splice(this._findElements(element), 1);
  }

  public isExpanded(element: IProfileLink): boolean {
    return this.expandedElements.length && this._findElements(element) >= 0;
  }

  public getLevelPadding(element: IProfileLink): string {
    if (!element.hasChildren && this.level === 0) { return '16px'; }
    if (element.hasChildren) { return `${(this.level * 40)}px`; }

    const level = this.level + 1 <= this.maxLevel ? this.level + 1 : this.level;
    return `${((level) * 40)}px`;
  }

  private _findElements(element: IProfileLink): number {
     return this.expandedElements.findIndex((e) => e.id === element.id);
  }

  private _getList(element: IProfileLink): void {
    if (!element.children) {
      this.expandedElement = element;
      this.expandInProgressDelayed = true;

      this._service.getList(this._buildFilter(element))
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (data) => element.children = data.items,
          complete: () => {
            this.expandInProgressDelayed = false;
            this._cdr.detectChanges();
          },
        });
    }
  }

  private _buildFilter(element: IProfileLink): Query<ProfileLinkFilter> {
    return new Query<ProfileLinkFilter>({
      withCount: true,
      filter: {
        parentId: element.id,
      },
    });
  }

}

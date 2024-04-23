import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';

// external libs
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// models
import { InvoiceItem, invoicing } from '../../../../models/invoicing.model';

// interfaces
import { ICompany } from '../../interfaces/company.interface';

// enums
import { ViewMode } from '../../../../enums/view-mode.enum';

// services
import { ToolbarActionsService } from '../../../../services/toolbar-actions.service';
import { CompanyService } from '../../services/company.service';
import { Utils } from '../../../../services';

@Component({
  selector: 'h21-company-invoicing',
  templateUrl: './company-invoicing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyInvoicingComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public form: FormGroup;
  @Input() public company: ICompany;
  @Input() public isAdmin: boolean;
  @Input() public mode: ViewMode;

  @Output() public emitMode: EventEmitter<ViewMode> = new EventEmitter<ViewMode>();
  @Output() public emitCompany: EventEmitter<ICompany> = new EventEmitter<ICompany>();

  public invoicing$: Observable<InvoiceItem[]> = of(invoicing);
  public viewMode = ViewMode;
  public companyData: ICompany;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private _toolbarActions: ToolbarActionsService,
              private _companyService: CompanyService,
              private _cdr: ChangeDetectorRef) { }

  public ngOnChanges(changes: SimpleChanges): void {
    changes.company && changes.company.currentValue && (this.company = changes.company.currentValue);
    changes.mode && changes.mode.currentValue && (this.mode = changes.mode.currentValue);
  }

  public ngOnInit() {
    setTimeout(() => { this._setToolbarActions(); }, 0);
    this.companyData = Utils.deepCopy(this.company);
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public trackByFn(index: number): number {
    return index;
  }

  public save(): void {
    if (this._isInvalidate()) {
      this.emitCompany.emit(this.company);
      return;
    }

    this._companyService.save(this.companyData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((company) => {
        this.companyData = company;
        this.emitCompany.emit(this.companyData);
        this._updateMode(ViewMode.View);
      });
  }

  private _cancel(): void {
    this.emitCompany.emit(this.companyData);
    this.company = Utils.deepCopy(this.companyData);
    this._updateMode(ViewMode.View);
  }

  private _edit(): void {
    this._updateMode(ViewMode.Edit);
  }

  private _updateMode(mode: ViewMode): void {
    this.mode = mode;
    this.emitMode.emit(this.mode);
    this._setToolbarActions();
    !(<ViewRef>this._cdr).destroyed && this._cdr.detectChanges();
  }

  private _isInvalidate(): boolean {
    Object.values(this.form.controls).forEach((control) => {
      control.enable();
      control.markAsTouched();
      control.updateValueAndValidity();
    });

    return this.form.invalid;
  }

  private _setToolbarActions(): void {
    this._toolbarActions.actions$.next([
      {
        name: 'save',
        disabled: false,
        tooltipText: 'Save',
        icon: 'save',
        action: () => this.save(),
        visible: this.mode !== ViewMode.View,
      },
      {
        name: 'cancel',
        disabled: false,
        tooltipText: 'Cancel',
        icon: 'undo',
        action: () => this._cancel(),
        visible: this.mode !== ViewMode.View,
      },
      {
        name: 'edit',
        disabled: this.mode !== ViewMode.View,
        tooltipText: 'Edit',
        icon: 'edit',
        action: () => this._edit(),
        visible: this.isAdmin && this.mode !== ViewMode.Add,
      },
    ]);
  }

}

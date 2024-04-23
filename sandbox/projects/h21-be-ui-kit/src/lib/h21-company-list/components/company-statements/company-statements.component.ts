import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// external libs
import { Observable, of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

// services
import { LoadProgressService } from '../../../../services/load-progress.service';

// enums
import { StatementDownloadType } from './enums/statement-download-type.enum';

// interfaces
import { IStatementSettings } from './interfaces/statement-settings.interface';

@Component({
  selector: 'h21-company-statements',
  templateUrl: './company-statements.component.html',
  styleUrls: [ './company-statements.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyStatementsComponent implements OnDestroy, OnInit {

  public headerHeight = '58px';
  public pending: boolean;
  public statementForm: FormGroup;
  public invoiceForm: FormGroup;
  public statementDownloadTypes = StatementDownloadType;

  private _destroy$ = new Subject<boolean>();

  constructor (
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _loadProgressService: LoadProgressService,
  ) {
    this.statementForm = this._getForm();
    this.invoiceForm = this._getForm();
  }

  public ngOnInit(): void {
    this._load();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public trackByFn(index: number): number {
    return index;
  }

  public trackByIndexFn(index: number, item: FormGroup): number {
    return item.value.index;
  }

  public removeEmailField(fg: FormGroup, index: number): void {
    const arr = <FormArray>fg.controls.emails;
    const n = arr.controls.findIndex((e) => e.get('index').value === index);
    arr.removeAt(n);
  }

  public addEmailField(fg: FormGroup, quantity: number = 1): void {
    for (let i = 0; i < quantity; i++) {
      (<FormArray>fg.get('emails')).push(
        this._fb.group({
          index: new FormControl(this._getEmailFieldNextIndex(fg)),
          value: new FormControl(null, Validators.email),
        }),
      );
    }
  }

  private _load(): void {
    this.pending = true;
    this._loadProgressService.show(2);
    this._getTestSettings().subscribe((data: IStatementSettings[]) => {
      this.pending = false;
      this._loadProgressService.hide(2);
      this._fillForm(this.statementForm, data[0]);
      this._fillForm(this.invoiceForm, data[1]);
      this._cdr.detectChanges();
    });
  }

  private _getForm(): FormGroup {
    const form = this._fb.group({
      downloadType: new FormControl(StatementDownloadType.excel),
      emails: this._fb.array([]),
    });
    this.addEmailField(form);
    return form;
  }

  private _fillForm(fg: FormGroup, st: IStatementSettings): void {
    const n = st.emails && st.emails.length ? st.emails.length : 0;
    n > 1 && this.addEmailField(fg, (n - 1));
    fg.get('downloadType').setValue(st.downloadType);

    if (n > 0) {
      for (let i = 0; i < n; i++) {
        (<FormArray>fg.controls.emails).controls[i].get('value').setValue(st.emails[i]);
      }
    }
  }

  private _getEmailFieldNextIndex(fg: FormGroup): number {
    let max = -1;
    (<FormArray>fg.get('emails')).controls.forEach((e) => {
      if (e.get('index').value > max) {
        max = e.get('index').value;
      }
    });
    return max !== -1 ? max + 1 : 0;
  }

  private _getTestSettings(): Observable<IStatementSettings[]> {
    return of([
      {
        id: 1,
        downloadType: StatementDownloadType.excel,
        emails: [
          'statement_1@test.com',
          'statement_2@test.com',
          'statement_3@test.com',
        ],
      },
      {
        id: 2,
        downloadType: StatementDownloadType.pdf,
        emails: [
          'invoice_1@test.com',
          'invoice_2@test.com',
          'invoice_3@test.com',
        ],
      },
    ]).pipe(delay(2000));
  }

}

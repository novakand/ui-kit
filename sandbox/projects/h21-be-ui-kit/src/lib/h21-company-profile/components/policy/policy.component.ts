import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

// external libs
import { Subject } from 'rxjs';

// services
import { LoadProgressService } from '../../../../services/load-progress.service';

@Component({
  selector: 'h21-policy',
  templateUrl: './policy.component.html',
  styleUrls: [ './policy.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolicyComponent implements OnDestroy, OnInit {

  public headerHeight = '58px';
  public pending: boolean;

  public refundableOnly: boolean;
  public refundableOnlyEnabled: boolean;
  public nonRefBufferDaysCtrl: FormControl;

  private _destroy$ = new Subject<boolean>();

  constructor (
    private _cdr: ChangeDetectorRef,
    private _loadProgressService: LoadProgressService,
  ) {
    this.nonRefBufferDaysCtrl = new FormControl(null, Validators.pattern(/^[0-9]+$/));
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

  private _load(): void {
    this.pending = true;
    this._loadProgressService.show(2);

    setTimeout(() => {
      this.refundableOnly = true;
      this.refundableOnlyEnabled = true;
      this.pending = false;
      this._loadProgressService.hide(2);
      this._cdr.detectChanges();
    }, 1000);
  }

}

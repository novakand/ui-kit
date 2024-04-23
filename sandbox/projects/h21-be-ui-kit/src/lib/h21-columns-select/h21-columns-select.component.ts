import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  ViewChild
} from '@angular/core';

import { ColumnsSelectAnimation } from '../../animations/column-select';
import { IH21Column } from '../h21-table/h21-column.interfaces';
import { H21ColumnsSelectRef } from './h21-columns-select-ref';
import { COLUMNS_DATA } from './h21-columns-select.tokens';
import { Utils } from '../../services/utils';

@Component ({
  selector: 'h21-columns-select',
  templateUrl: './h21-columns-select.component.html',
  animations: ColumnsSelectAnimation,
})
export class H21ColumnsSelectComponent implements AfterViewInit {

  public animationState: 'void' | 'enter' | 'leave' = 'enter';
  public animationStateChanged = new EventEmitter<AnimationEvent>();

  public backup: IH21Column[];
  public columns: IH21Column[];

  @ViewChild('container') private _container: ElementRef;

  constructor(public dialogRef: H21ColumnsSelectRef,
              @Inject(COLUMNS_DATA) _columns: IH21Column[],
  ) {
    this.columns = _columns.concat([]);
    this.backup = Utils.deepCopy(this.columns);
  }

  public ngAfterViewInit() {
    this._container.nativeElement.focus();
  }

  public trackByFn(index) {
    return index;
  }

  public onAnimationStart(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  public onAnimationDone(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  public startExitAnimation(): void {
    this.animationState = 'leave';
  }

  public setDefault(): void {
    this.columns.forEach((item) => {
      item.displayed = item.default;
    });
  }

  public apply(): void {
    this.dialogRef.close(this.columns);
  }

  public close(): void {
    this.dialogRef.close(this.backup);
  }

}

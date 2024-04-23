import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'h21-sort-table',
  templateUrl: './h21-sort-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class H21SortTableComponent {

  @Input() public fieldName: string;
  @Input() public orderField: string;
  @Input() public desc: boolean;

  public isOrderField(): boolean {
    return this.orderField === this.fieldName;
  }

}

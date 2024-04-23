import { Component, Input } from '@angular/core';

import { ISearchHistoryCard } from './models';

@Component({
  selector: 'h21-search-history-panel',
  templateUrl: './h21-search-history-panel.component.html',
})
export class H21SearchHistoryPanelComponent {

  @Input() public data: ISearchHistoryCard[];

  public trackByFn(index) {
    return index;
  }

}

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { H21AirFilterPanelViewMode } from './h21-air-filter-panel-view-mode.enum';
import { SearchFlight } from '../../models';

@Component({
  selector: 'h21-air-filter-panel',
  templateUrl: './h21-air-filter-panel.component.html',
})
export class H21AirFilterPanelComponent {

  @Input() public searchOptions: SearchFlight;
  @Input() public viewMode: H21AirFilterPanelViewMode;
  @Output() public changedViewMode: EventEmitter<H21AirFilterPanelViewMode>;

  public priceSliderConfig: any;
  public matExpansionPanelHeaderDefaultHeight: string;
  public minPrice: number;
  public maxPrice: number;
  public currencyName: string;

  constructor() {
    this.init();
  }

  public init() {
    this.matExpansionPanelHeaderDefaultHeight = '44px';
    this.minPrice = 1;
    this.maxPrice = 5000;
    this.currencyName = 'EUR';
    this.viewMode = H21AirFilterPanelViewMode.List;
    this.changedViewMode = new EventEmitter<H21AirFilterPanelViewMode>();
    this.priceSliderConfig = {
      behaviour: 'drag',
      connect: true,
      start: [250, 750],
      step: 1,
      tooltips: [ true, true ],
      range: {
        min: this.minPrice,
        max: this.maxPrice,
      },
    };
  }

  public changeViewMode(mode: H21AirFilterPanelViewMode): void {
    this.changedViewMode.emit(mode);
  }

}

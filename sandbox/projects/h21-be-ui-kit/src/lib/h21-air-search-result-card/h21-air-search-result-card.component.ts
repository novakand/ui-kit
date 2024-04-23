import { Component, Input } from '@angular/core';

import { FlightItem, FlightItemGroup } from '../../models';

@Component({
  selector: 'h21-air-search-result-card',
  templateUrl: './h21-air-search-result-card.component.html',
})
export class H21AirSearchResultCardComponent {

  @Input() public data: FlightItemGroup;

  public getTimeString(item: FlightItem): string {
    let result = '';
    const h = Math.floor(item.elapsedTime / 60);
    if (h && h > 0) {
      result = `${h}h `;
    }
    const m = item.elapsedTime % 60;
    if (m && m > 0) {
      result += `${m}m `;
    }
    if (item.transfers) {
      if (item.transfers.length === 1) {
        result += '(1 stop)';
      } else {
        result += `(${item.transfers.length} stops)`;
      }
    }
    return result.trim();
  }

  public trackByFn(index) {
    return index;
  }

}

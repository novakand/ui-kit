import { Component, EventEmitter, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

import { AirSearchResultAnimation } from '../../animations/h21-air-search-result';
import { VocabularyService } from '../../services/vocabulary-service';
import { FlightItemGroup } from '../../models/flight-item-group.model';
import { SearchFlight } from '../../models/search-flight.model';

@Component ({
  selector: 'h21-air-search-result',
  templateUrl: './h21-air-search-result.component.html',
  viewProviders: [MatIconRegistry],
  animations: AirSearchResultAnimation,
})
export class H21AirSearchResultComponent {

  @Output() public searchedResultReady: EventEmitter<FlightItemGroup[]> = new EventEmitter<FlightItemGroup[]>();

  public showFakeResult: boolean;
  public searchInProgress: boolean;
  public searchResultReady: boolean;

  public titleText: string;
  public subTitleText: string;

  public resultCheapest: FlightItemGroup[];
  public resultShortest: FlightItemGroup[];
  public resultRecommended: FlightItemGroup[];

  constructor(private _vocabulary: VocabularyService,
              private _iconReg: MatIconRegistry,
              private _sanitizer: DomSanitizer,
  ) {
    this._iconReg.addSvgIcon('h21_baggage',
      this._sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-baggage-blue.svg'));
    this._iconReg.addSvgIcon('h21_no_baggage',
      this._sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-no-baggage-gray.svg'));
    this._iconReg.addSvgIcon('h21_luggage',
      this._sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-luggage-blue.svg'));
    this._iconReg.addSvgIcon('h21_no_luggage',
      this._sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-no-luggage-gray.svg'));
    this._iconReg.addSvgIcon('h21_night',
      this._sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-night-blue.svg'));
    this.init();
  }

  public init() {
    this.titleText = '';
    this.subTitleText = '';
    this.searchInProgress = false;
    this.searchResultReady = false;
    this.showFakeResult = false;
  }

  public trackByFn(index) {
    return index;
  }

  public search(options: SearchFlight): void {
    this.searchInProgress = true;
    this.showFakeResult = true;
    this.searchResultReady = false;
    setTimeout(() => {
      this._vocabulary.searchFlights(options)
        .subscribe({
          next: (result) => {
            this.searchInProgress = false;
            this.showFakeResult = false;

            if (result.groups) {
              this.titleText = 'London (LON) to - Barcelona (BCN) 2 flights';
              this.subTitleText = 'Fri 18 May - Fri 25 May 1 adult. Economy';
              this.resultRecommended = result.groups;
              this.resultCheapest = result.groups.map((x) => x).sort((a, b) => a.price - b.price);
              this.resultShortest = result.groups.map((x) => x).sort((a, b) => a.totalElapsedTime - b.totalElapsedTime);
            } else {
              this.titleText = '';
              this.subTitleText = '';
              this.resultRecommended = [];
              this.resultCheapest = [];
              this.resultShortest = [];
            }
          },
        });

      setTimeout(() => {
        this.searchResultReady = true;
        this.searchedResultReady.emit(this.resultRecommended);
      }, 250);
    }, 2000);
  }

  public clear(): void {
    this.titleText = '';
    this.subTitleText = '';
    this.searchInProgress = true;
    this.showFakeResult = true;
    this.searchResultReady = false;
    this.resultRecommended = [];
    this.resultCheapest = [];
    this.resultShortest = [];
  }

  public getPriceString(groups: FlightItemGroup[]): string {
    return groups && groups[0] ? groups[0].price.toString() : '0';
  }

  public getTimeString(groups: FlightItemGroup[]): string {
    if (!groups || groups.length === 0) {
      return '';
    }
    const group = groups[0];
    let result = '';
    const h = Math.floor(group.totalElapsedTime / 60);
    if (h && h > 0) {
      result = `${h}h `;
    }
    const m = group.totalElapsedTime % 60;
    if (m && m > 0) {
      result += `${m}m `;
    }
    return result.trim();
  }

}

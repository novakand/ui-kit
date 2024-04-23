import { Component, EventEmitter, Output, ViewChildren } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { H21FlyRouteSelectionComponent } from './h21-fly-route-selection.component';
import { AppSubscriberService } from '../../services/app-subscriber-service';
import { FlyRoute, SearchFlight } from '../../models';

@Component({
  selector: 'h21-air-search-panel',
  templateUrl: './h21-air-search-panel.component.html',
})
export class H21AirSearchPanelComponent {

  @Output() public clearedSearch: EventEmitter<void>;
  @Output() public searched: EventEmitter<SearchFlight>;

  public searchOptions: SearchFlight;

  @ViewChildren(H21FlyRouteSelectionComponent) private _routes: H21FlyRouteSelectionComponent[];

  constructor(private _snackBar: MatSnackBar,
              private _appSubscriber: AppSubscriberService,
  ) {
    this.init();
  }

  public init() {
    this.searched = new EventEmitter<SearchFlight>();
    this.clearedSearch = new EventEmitter<void>();

    this.searchOptions = new SearchFlight({
      flyRoutes: [new FlyRoute({
        minDate: new Date(),
        rangeDateMode: true,
      })],
      searchMode: 'round_trip',
      anyNumberOfStops: true,
      nonstopOnly: true,
      oneStopOfFewer: true,
      directFlight: false,
      refundableFlights: false,
      showTransfers: false,
      showHotels: false,
    });
  }

  public trackByFn(index) {
    return index;
  }

  public addFlyRoute() {
    if (this.searchOptions.flyRoutes.length === 5) {
      this._snackBar.open('Maximum of routes is 5', '', {
        duration: 1000,
        panelClass: 'c-h21-passengers-error_snackbar',
      });
      return;
    }

    const flyRoute = new FlyRoute();
    const previous = this.searchOptions.flyRoutes[this.searchOptions.flyRoutes.length - 1];

    if (!previous.cityFrom || !previous.cityTo || !previous.departureDate) {
      this._snackBar.open('Please fill last route', '', {
        duration: 1000,
        panelClass: 'c-h21-passengers-error_snackbar',
      });
      return;
    }
    flyRoute.minDate = previous.departureDate;
    flyRoute.cityFrom = previous.cityTo;
    flyRoute.cityTo = previous.cityFrom;
    flyRoute.departureDate = new Date(previous.departureDate);
    flyRoute.departureDate.setDate(flyRoute.departureDate.getDate() + 4);

    this.searchOptions.flyRoutes.push(flyRoute);
  }

  public removeFlyRoute() {
    this.searchOptions.flyRoutes.pop();
  }

  public canAdd(i: number): boolean {
    return (
      this.searchOptions.flyRoutes.length === i + 1 && this.searchOptions.searchMode === 'multi_city'
    );
  }

  public canRemove(i: number): boolean {
    return this.searchOptions.searchMode === 'multi_city' && this.searchOptions.flyRoutes.length === i + 1 && i !== 0;
  }

  public changeMode() {
    switch (this.searchOptions.searchMode) {
      case 'one_way':
      case 'multi_city': {
        this.searchOptions.flyRoutes[0].rangeDateMode = false;
        break;
      }
      case 'round_trip': {
        this.searchOptions.flyRoutes[0].rangeDateMode = true;
        break;
      }
    }
  }

  public clearSearch() {
    this.searchOptions = new SearchFlight({
      flyRoutes: [new FlyRoute({
        minDate: new Date(),
        rangeDateMode: true,
      })],
      searchMode: 'round_trip',
      anyNumberOfStops: true,
      nonstopOnly: true,
      oneStopOfFewer: true,
      directFlight: false,
      refundableFlights: false,
      showTransfers: false,
      showHotels: false,
    });

    this._appSubscriber.clearSearch();
    this.clearedSearch.emit();
  }

  public search() {
    let hasErrors = false;
    this._routes.forEach((route: H21FlyRouteSelectionComponent) => {
      route.validate();
      hasErrors = route.invalid ? route.invalid : hasErrors;
    });

    if (!hasErrors) {
      this.searched.emit(this.searchOptions);
    }
  }

}

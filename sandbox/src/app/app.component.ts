import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconRegistry, MatSidenav } from '@angular/material';

import { H21RightOverlayPanelService } from '../../projects/h21-be-ui-kit/src/lib/h21-right-overlay-panel';
import { H21AirSearchResultComponent, H21StorageThemeService } from '../../projects/h21-be-ui-kit/src/lib';
import { ISearchHistoryCard } from '../../projects/h21-be-ui-kit/src/lib/h21-search-history-panel/models';
import { H21AirFilterPanelViewMode } from '../../projects/h21-be-ui-kit/src/lib/h21-air-filter-panel';
import { AppSubscriberService, SettingsService } from '../../projects/h21-be-ui-kit/src/services';
import { H21SidebarComponent } from '../../projects/h21-be-ui-kit/src/lib/h21-sidebar';
import { DocsNavigationComponent } from './docs-navigation/docs-navigation.component';
import { ISidebarNavTab } from '../../projects/h21-be-ui-kit/src/interfaces';
import { SearchFlight } from '../../projects/h21-be-ui-kit/src/models';
import { DocsComponent } from './docs/docs.component';

const SIDEBAR_NAV_TABS: ISidebarNavTab[] = [
  { name: 'search', label: 'Search', icon: 'search', type: 'button', url: null, disabled: false },
  { name: 'filter', label: 'Filter', icon: 'filter_list', type: 'button', url: null, disabled: false },
  { name: 'history', label: 'History', icon: 'history', type: 'button', url: null, disabled: false },
  { name: 'test', label: 'Map point', icon: 'not_listed_location', type: 'button', url: null, disabled: false },
];

const SEARCH_HISTORY_DATA: ISearchHistoryCard[] = [
  { id: 1, payment: 'Payment on account', destination: 'Amsterdam, Netherlands', adultCount: 2, roomCount: 1 },
  { id: 2, payment: 'Payment on account', destination: 'Amsterdam, Netherlands', adultCount: 2, roomCount: 1 },
  { id: 3, payment: 'Payment on account', destination: 'Amsterdam, Netherlands', adultCount: 2, roomCount: 1 },
  { id: 4, payment: 'Payment on account', destination: 'Amsterdam, Netherlands', adultCount: 2, roomCount: 1 },
];

@Component({
  selector: 'h21-app-root',
  templateUrl: './app.component.html',
  viewProviders: [MatIconRegistry],
})
export class AppComponent implements OnInit {

  public title = 'HORSE21.PRO - Component design system';
  public subscription: any;
  public sidebarOpened = false;
  public searchHistoryData: ISearchHistoryCard[];
  public activeLeftSidenavPanel = 'search';
  public sidenavOpened = false;
  public searchResultVisibility = false;
  public airbeSearchResultViewMode: H21AirFilterPanelViewMode = H21AirFilterPanelViewMode.List;
  public sidebarNavDisabled = true;
  public sidebarNavTabs: ISidebarNavTab[];

  public leftSidenavOpened = false;

  public contentSidenavHasBackdrop = false;

  @ViewChild(DocsNavigationComponent) private docsNavigation: DocsNavigationComponent;
  @ViewChild(H21SidebarComponent) private sidebar: H21SidebarComponent;
  @ViewChild(DocsComponent) private docs: DocsComponent;

  @ViewChild('airbeSearchResult') private airbeSearchResult: H21AirSearchResultComponent;
  @ViewChild('rightSidenav') private rightSidenav: MatSidenav;
  @ViewChild('leftSidenav') private leftSidenav: MatSidenav;

  constructor(public router: Router,
              public sanitizer: DomSanitizer,
              public iconReg: MatIconRegistry,
              private settingService: SettingsService,
              private _service: H21StorageThemeService,
              private _appSubscriber: AppSubscriberService,
              private rightPanelDialog: H21RightOverlayPanelService,
  ) {
    this.iconReg.addSvgIcon('logo',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/img/horse21-logo.svg'));
    this.iconReg.addSvgIcon('h21_flight_land_blue',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-flight-land-blue-icon.svg'));
    this.iconReg.addSvgIcon('h21_flight_land_green',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-flight-land-green-icon.svg'));
    this.iconReg.addSvgIcon('h21_flight_land_red',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-flight-land-red-icon.svg'));
    this.iconReg.addSvgIcon('h21_flight_takeoff_blue',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-flight-takeoff-blue-icon.svg'));
    this.iconReg.addSvgIcon('h21_flight_takeoff_green',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-flight-takeoff-green-icon.svg'));
    this.iconReg.addSvgIcon('h21_flight_takeoff_red',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-flight-takeoff-red-icon.svg'));

    this.iconReg.addSvgIcon('h21_baggage',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-baggage-blue.svg'));
    this.iconReg.addSvgIcon('h21_no_baggage',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-no-baggage-gray.svg'));
    this.iconReg.addSvgIcon('h21_luggage',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-luggage-blue.svg'));
    this.iconReg.addSvgIcon('h21_no_luggage',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-no-luggage-gray.svg'));
    this.iconReg.addSvgIcon('h21_night',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-night-blue.svg'));
    this.iconReg.addSvgIcon('h21_back_to_list',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-back-to-list-gray.svg'));

    this.settingService.setEnvironment({
      fileStorageUrl: 'http://localhost:5010/api/FileInfo/',
    });

    this.init();
  }

  public ngOnInit(): void {
    if (this.docsNavigation) {
      this.subscription = this.docsNavigation.getEmitter()
        .subscribe((item) => this.docs.changeComponent(item));
    }
  }

  public toggleSidebarOpened() {
    this.sidebarOpened = !this.sidebarOpened;
  }

  public isDemoHotel(): boolean {
    return this.router.url.indexOf('/demo/hotel') === 0;
  }

  public isDemoAirBe(): boolean {
    return this.router.url.indexOf('/demo/airbe') === 0;
  }

  public changeComponent(event): void {
    this.docs.changeComponent(event);
  }

  public openHelpSection(): void {
    this.rightPanelDialog.open('h21-help');
  }

  public leftSidenavToggle() {
    this.leftSidenav.toggle();
    if (this.leftSidenav.opened) {
      this.sidebarNavDisabled = false;
      this.airbeSearchResultViewMode = H21AirFilterPanelViewMode.List;
      this.sidenavOpened = true;
    } else {
      this.sidebarNavDisabled = true;
      this.sidenavOpened = false;
    }
  }

  public showSidebarPanel(tab: ISidebarNavTab): void {
    if (!this.leftSidenav.opened) {
      this.leftSidenavToggle();
    }
    this.activeLeftSidenavPanel = tab.name;
  }

  public airbeSearch(options: SearchFlight): void {
    this.searchResultVisibility = true;
    this.sidebarNavTabs.find((item) => item.name === 'filter').disabled = false;
    setTimeout(() => {
      this.airbeSearchResult.search(options);
    }, 0);
  }

  public airbeClearSearch(): void {
    this.searchResultVisibility = false;
    this.sidebarNavTabs.find((item) => item.name === 'filter').disabled = true;
    if (this.airbeSearchResult) {
      this.airbeSearchResult.clear();
    }
  }

  public airbeChangeResultViewMode(mode: H21AirFilterPanelViewMode): void {
    this.airbeSearchResultViewMode = mode;
  }

  public isRoute(route: string) {
    return this.router.url.indexOf(route) >= 0;
  }

  public init() {
    this.searchHistoryData = SEARCH_HISTORY_DATA;
    this.sidebarNavTabs = SIDEBAR_NAV_TABS;
  }

}

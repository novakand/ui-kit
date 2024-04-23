import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { DxTemplateModule } from 'devextreme-angular/core/template';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { NouisliderModule } from 'ng2-nouislider';
import { NgxMdModule } from 'ngx-md';

// import H21 components, tokens, modules
import {
  DIALOG_PANEL_COMPONENT,
  DIALOG_PANEL_DATA,
  H21AccountSelectComponent,
  H21AirFilterPanelComponent,
  H21AirSearchPanelComponent,
  H21AirSearchResultCardComponent,
  H21AirSearchResultComponent,
  H21AutocompleteComponent,
  H21BreadcrumbsComponent,
  H21CartComboboxComponent,
  H21ComboboxComponent,
  H21CounterComponent,
  H21DialogPanelComponent,
  H21ErrorPageComponent,
  H21ErrorPageSupportDialogComponent,
  H21FlyRouteSelectionComponent,
  H21HeaderModule,
  H21HelpComponent,
  H21HistoryComponent,
  H21InDevelopmentComponent,
  H21PassengersSelectComponent,
  H21ProfileImageComponent,
  H21ProfileImageModule,
  H21RateComponent,
  H21RightOverlayPanelComponent,
  H21SearchHistoryPanelComponent,
  H21SelectComponent,
  H21SidebarComponent,
  H21SidebarNavComponent,
  H21SlideCarouselComponent,
  H21SlideCarouselDialogComponent,
  H21StandardDialogModule,
  H21TopToolbarComponent,
  H21TwoMonthCalendarComponent,
  H21TwoMonthCalendarDialogComponent,
} from '../../projects/h21-be-ui-kit/src/lib';

// import H21 services
import { H21NotificationListDialogService } from '../../projects/h21-be-ui-kit/src/lib/h21-header/h21-notification-list-dialog';
import { H21RightOverlayPanelService } from '../../projects/h21-be-ui-kit/src/lib/h21-right-overlay-panel';
import { H21AccountSelectService } from '../../projects/h21-be-ui-kit/src/lib/h21-accout-select';
import { H21DefaultDialogService } from '../../projects/h21-be-ui-kit/src/lib/dialogs';

// import examples components
import {
  AutocompleteDocsComponent,
  ButtonsDocsComponent,
  ButtonToggleDocsComponent,
  ColorsDocsComponent,
  CounterInputComponent,
  DashboardComponent,
  DialogPanelComponent,
  DocsComponent,
  FormsDocsComponent,
  GridDocsComponent,
  H21TableAgenciesComponent,
  H21TableAgentsComponent,
  H21TableProvidersComponent,
  H21TableTravelersComponent,
  H21TableUsersComponent,
  HeaderDocsComponent,
  IconExampleDialogComponent,
  IconsDocsComponent,
  ImagesDocsComponent,
  InDevelopmentDocsComponent,
  LayoutDocsComponent,
  LogotypeDocsComponent,
  MapsComponent,
  ProfileImageDocsComponent,
  SearchComponentsDocsComponent,
  SelectDocsComponent,
  TabsDocsComponent,
  TooltipsDocsComponent,
  TopToolbarDocsComponent,
  TwoMonthCalendarDocsComponent,
  TypographyDocsComponent,
} from './docs';
import { DocsExampleViewerComponent } from './docs-example-viewer';
import { DocsNavigationComponent } from './docs-navigation';
import { AppComponent } from './app.component';

// import examples services
import {
  AppSubscriberService,
  FileUploaderService,
  H21TopToolbarService,
  OrderService,
  SettingsService,
  VocabularyService
} from '../../projects/h21-be-ui-kit/src/services';
import { FakeVocabularyService } from '../services';

// import examples modules
import { AppMaterialModule, AppRoutingModule } from './modules';

// import examples pipes
import { H21WhiteLabelModule } from '../../projects/h21-be-ui-kit/src/lib/h21-white-label/h21-white-label.module';
import { H21PipesModule } from '../../projects/h21-be-ui-kit/src/pipes';
import { AppInsightsService } from '@markpieszak/ng-application-insights';

@NgModule({
  declarations: [
    AppComponent,
    H21TopToolbarComponent,
    H21SidebarComponent,
    H21AirSearchPanelComponent,
    H21AirSearchResultComponent,
    H21AirSearchResultCardComponent,
    H21FlyRouteSelectionComponent,
    H21PassengersSelectComponent,
    H21AirFilterPanelComponent,
    H21BreadcrumbsComponent,
    H21RightOverlayPanelComponent,
    H21HelpComponent,
    H21HistoryComponent,
    H21TwoMonthCalendarComponent,
    H21TwoMonthCalendarDialogComponent,
    H21CounterComponent,
    H21RateComponent,
    H21SearchHistoryPanelComponent,
    H21SidebarNavComponent,
    DocsNavigationComponent,
    DocsComponent,
    DocsExampleViewerComponent,
    ButtonsDocsComponent,
    ButtonToggleDocsComponent,
    ColorsDocsComponent,
    FormsDocsComponent,
    GridDocsComponent,
    IconsDocsComponent,
    ImagesDocsComponent,
    LayoutDocsComponent,
    LogotypeDocsComponent,
    SearchComponentsDocsComponent,
    TabsDocsComponent,
    TooltipsDocsComponent,
    TypographyDocsComponent,
    IconExampleDialogComponent,
    TwoMonthCalendarDocsComponent,
    CounterInputComponent,
    DashboardComponent,
    TopToolbarDocsComponent,
    HeaderDocsComponent,
    InDevelopmentDocsComponent,
    H21TableUsersComponent,
    H21TableAgentsComponent,
    H21TableAgenciesComponent,
    H21TableTravelersComponent,
    H21TableProvidersComponent,
    MapsComponent,
    H21SlideCarouselComponent,
    H21CartComboboxComponent,
    H21SlideCarouselDialogComponent,
    H21AccountSelectComponent,
    H21ComboboxComponent,
    H21AutocompleteComponent,
    H21SelectComponent,
    AutocompleteDocsComponent,
    SelectDocsComponent,
    ProfileImageDocsComponent,
    H21DialogPanelComponent,
    DialogPanelComponent,
    H21InDevelopmentComponent,
    H21ErrorPageComponent,
    H21ErrorPageSupportDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NouisliderModule,
    NgxMdModule.forRoot(),
    DxDataGridModule,
    DxTemplateModule,
    MatDialogModule,
    H21PipesModule,
    H21WhiteLabelModule,
    H21StandardDialogModule,
    H21ProfileImageModule,
    H21HeaderModule.forRoot({
      clientId: 'js',
      redirectUri: 'http://localhost:4200/',
      issuer: 'https://identity21pro.azurewebsites.net/',
      scope: 'openid profile email identityserver',
    }),
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: VocabularyService,
      useValue: new FakeVocabularyService(),
    },
    {
      provide: DIALOG_PANEL_DATA,
      useValue: {},
    },
    {
      provide: DIALOG_PANEL_COMPONENT,
      useValue: null,
    },
    FileUploaderService,
    SettingsService,
    H21RightOverlayPanelService,
    H21AccountSelectService,
    H21TopToolbarService,
    AppSubscriberService,
    H21DefaultDialogService,
    OrderService,
    H21NotificationListDialogService,
    AppInsightsService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    IconExampleDialogComponent,
    H21TwoMonthCalendarDialogComponent,
    H21RightOverlayPanelComponent,
    H21AccountSelectComponent,
    H21SlideCarouselDialogComponent,
    H21ProfileImageComponent,
    H21ErrorPageSupportDialogComponent,
  ],
})
export class AppModule { }

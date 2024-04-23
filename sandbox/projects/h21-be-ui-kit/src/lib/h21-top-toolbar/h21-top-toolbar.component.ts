import { Component, EventEmitter, Input, Output } from '@angular/core';

// services
import { H21TopToolbarService } from '../../services/h21-top-toolbar.service';

// models
import { IProviderDataLoadingStatistic, IToolbarActionButton } from './models';
import { IBreadcrumb } from '../h21-breadcrumbs/models';

// interfaces
import { IComboboxOption } from '../../interfaces/combobox-option.interface';

@Component({
  selector: 'h21-top-toolbar',
  templateUrl: './h21-top-toolbar.component.html',
})
export class H21TopToolbarComponent {

  @Input() public showBreadcrumbs: boolean;
  @Input() public breadcrumbsData: IBreadcrumb[];
  @Input() public showCart: boolean;
  @Input() public showSidenavToggle: boolean;
  @Input() public sidenavToggleDisabled: boolean;
  @Input() public sidenavOpened: boolean;
  @Input() public showLanguageControl: boolean;
  @Input() public showCurrencyControl: boolean;
  @Input() public showProviderDataLoading: boolean;
  @Input() public providerDataLoadingStatistic: IProviderDataLoadingStatistic;
  // deprecated
  @Input() set toolbarActions(data: IToolbarActionButton[]) {
    this.toolbarService.actions = data;
  }

  @Output() public sidenavToggled: EventEmitter<void>;
  @Output() public updateSearchResultClick: EventEmitter<void>;
  @Output() public toolbarActionClicked: EventEmitter<IToolbarActionButton>;

  public languageOptionsTooltipText: string;
  public currencyOptionsTooltipText: string;
  public selectedLanguage: any;
  public selectedCurrency: any;
  public languageOptions: IComboboxOption[];
  public currencyOptions: IComboboxOption[];

  constructor(public toolbarService: H21TopToolbarService) {
    this.init();
  }

  public init() {
    this.showProviderDataLoading = false;
    this.showBreadcrumbs = false;
    this.showCart = false;
    this.showSidenavToggle = false;
    this.sidenavToggleDisabled = false;
    this.sidenavOpened = false;
    this.showLanguageControl = false;
    this.showCurrencyControl = false;
    this.sidenavToggled = new EventEmitter<void>();
    this.updateSearchResultClick = new EventEmitter<void>();
    this.toolbarActionClicked = new EventEmitter<IToolbarActionButton>();
    this.languageOptionsTooltipText = 'Select language';
    this.currencyOptionsTooltipText = 'Select currency';
    this.selectedLanguage = 2;
    this.selectedCurrency = 978;
    // todo: Do download data from an external source
    this.languageOptions = [
      { value: 1, valueLabel: 'DEU', optionLabel: 'German (Deutsch)' },
      { value: 2, valueLabel: 'ENG', optionLabel: 'English (English)' },
      { value: 3, valueLabel: 'FRA', optionLabel: 'French (Français)' },
      { value: 4, valueLabel: 'RUS', optionLabel: 'Russian (Русский)' },
    ];
    // todo: Do download data from an external source
    this.currencyOptions = [
      { value: 978, valueLabel: 'EUR', optionLabel: 'EUR (Euro)' },
      { value: 840, valueLabel: 'USD', optionLabel: 'USD (US Dollar)' },
      { value: 643, valueLabel: 'RUB', optionLabel: 'RUB (Russian Ruble)' },
      { value: 826, valueLabel: 'GBP', optionLabel: 'GBP (United kingdom Pound)' },
      { value: 392, valueLabel: 'JPY', optionLabel: 'JPY (Japanese Yen)' },
      { value: 710, valueLabel: 'ZAR', optionLabel: 'ZAR (South African Rand)' },
    ];

  }

  public trackByFn(index) {
    return index;
  }

  public toolbarActionClick(e: IToolbarActionButton): void {
    if (e.action) {
      e.action();
    }
    this.toolbarActionClicked.emit(e);
  }

  public updateSearchResult(): void {
    this.updateSearchResultClick.emit();
  }

  public sidenavToggle(): void {
    this.sidenavOpened = !this.sidenavOpened;
    this.sidenavToggled.emit();
  }

}

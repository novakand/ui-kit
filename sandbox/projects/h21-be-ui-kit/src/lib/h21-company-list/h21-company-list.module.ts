import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Inject, LOCALE_ID, ModuleWithProviders, NgModule } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import localeEu from '@angular/common/locales/eu';
import { RouterModule } from '@angular/router';
import { A11yModule } from '@angular/cdk/a11y';
registerLocaleData(localeEu);

// material
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule,
} from '@angular/material';

// guards
import { CompaniesGuard } from '../../guards/companies.guard';

// routes
import { routing } from './h21-company-list-routing.module';

// components
// tslint:disable
import { CompanyBankAccountEditComponent } from './components/company-payment-method/company-bank-account-edit/company-bank-account-edit.component';
import { CompanyPaymentMethodListComponent } from './components/company-payment-method/company-payment-method-list/company-payment-method-list.component';
import { CompanyPaymentDialogComponent } from './components/company-payment-method/company-payment-dialog/company-payment-dialog.component';
// tslint:enable
import { CreditCardDialogComponent } from './components/company-payment-method/company-credit-card-dialog/credit-card-dialog.component';
import { CompanyAddressEditComponent } from './components/company-address/company-address-edit/company-address-edit.component';
import { CompanyAddressListComponent } from './components/company-address/company-address-list/company-address-list.component';
import { CompanyContactEditComponent } from './components/company-contact/company-contact-edit/company-contact-edit.component';
import { CompanyContactListComponent } from './components/company-contact/company-contact-list/company-contact-list.component';
import { CompanyProfileCardComponent } from './components/company-profile/company-profile-card/company-profile-card.component';
import { CompanyNoteEditComponent } from './components/company-note/company-note-edit/company-note-edit.component';
import { CompanyNoteListComponent } from './components/company-note/company-note-list/company-note-list.component';
import { CompanyVersionComponent } from './components/company-profile/company-version/company-version.component';
import { CompanyFilterComponent } from './components/company-filter/company-filter.component';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { CompanyStatementsComponent } from './components/company-statements/company-statements.component';

// services
import { CompanyAddressEditService } from './components/company-address/company-address-edit/company-address-edit.service';
import { CompanyContactEditService } from './components/company-contact/company-contact-edit/company-contact-edit.service';
import { CompanyProfileCardFormValidatorService } from './services/company-profile-card-form-validator.service';
import { CompanyNoteEditService } from './components/company-note/company-note-edit/company-note-edit.service';
import { CompanySettingService } from '../h21-company-profile/services/company-setting.service';
import { CompanyFilterService } from './components/company-filter/company-filter.service';
import { SettingsService } from '../../services/settings.service';
import { CompanyService } from './services/company.service';
import { CompanyListStorageService } from './storage.service';

// modules
import { H21ProfileImageModule } from '../h21-profile-image/h21-profile-image.module';
import { H21AutocompleteModule } from '../h21-autocomplete/h21-autocomplete.module';
import { H21DialogPanelModule } from '../h21-dialog-panel/h21-dialog-panel.module';
import { H21TableLoaderModule } from '../h21-table-loader/h21-table-loader.module';
import { H21CardLoaderModule } from '../h21-card-loader/h21-card-loader.module';
import { H21DirectivesModule } from '../../directives/h21-directives.module';
import { H21SortIconModule } from '../h21-sort-icon/h21-sort-icon.module';
import { H21HistoryModule } from '../h21-history/h21-history.module';
import { H21PipesModule } from '../../pipes/h21-pipes.module';

// interfaces
import { ICoreEnvironment } from '../../interfaces/core-environment.interface';

// tokens
import { CORE_ENVIRONMENT } from './core-environment.token';
import { DIALOG_PANEL_COMPONENT, DIALOG_PANEL_DATA } from '../h21-dialog-panel/h21-dialog-panel.tokens';

// models
import { H21DateAdapter } from '../../models/h21-date-adapter';
import { H21_DATE_FORMATS } from '../../models/date-format';

// libs
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [
    CompanyAddressEditComponent,
    CompanyAddressListComponent,
    CompanyBankAccountEditComponent,
    CompanyPaymentMethodListComponent,
    CompanyContactEditComponent,
    CompanyContactListComponent,
    CompanyFilterComponent,
    CompanyListComponent,
    CompanyNoteEditComponent,
    CompanyNoteListComponent,
    CompanyProfileCardComponent,
    CompanyVersionComponent,
    CompanyPaymentDialogComponent,
    CreditCardDialogComponent,
    CompanyStatementsComponent,
  ],
  imports: [
    routing,
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTabsModule,
    MatTooltipModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatInputModule,
    H21ProfileImageModule,
    MatChipsModule,
    MatIconModule,
    A11yModule,
    H21AutocompleteModule,
    H21SortIconModule,
    H21DirectivesModule,
    H21HistoryModule,
    H21CardLoaderModule,
    H21TableLoaderModule,
    H21PipesModule,
    MatMenuModule,
    H21DialogPanelModule,
    MatSlideToggleModule,
    NgxMaskModule.forRoot(),
    MatAutocompleteModule,
    MatExpansionModule,
    MatRadioModule,
  ],
  providers: [
    CompaniesGuard,
    CompanyFilterService,
    CompanySettingService,
    CompanyContactEditService,
    CompanyNoteEditService,
    CompanyAddressEditService,
    CompanyService,
    CompanyProfileCardFormValidatorService,
    {
      provide: DIALOG_PANEL_DATA,
      useValue: {},
    },
    {
      provide: DIALOG_PANEL_COMPONENT,
      useValue: null,
    },
    {
      provide: DateAdapter,
      useClass: H21DateAdapter,
      deps: [MAT_DATE_LOCALE, Platform],
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: H21_DATE_FORMATS,
    },
    { provide: LOCALE_ID, useValue: 'eu' },
  ],
  entryComponents: [
    CompanyFilterComponent,
    CompanyContactEditComponent,
    CompanyBankAccountEditComponent,
    CompanyPaymentDialogComponent,
    CompanyNoteEditComponent,
    CompanyAddressEditComponent,
    CompanyVersionComponent,
    CreditCardDialogComponent,
  ],
})
export class H21CompanyListModule {

  public static forChild(StorageService): ModuleWithProviders {
    return {
      ngModule: H21CompanyListModule,
      providers: [
        {
          provide: CompanyListStorageService,
          useExisting: StorageService,
        },
      ],
    };
  }

  constructor(
    @Inject(CORE_ENVIRONMENT) core: ICoreEnvironment,
    _settingsService: SettingsService,
  ) {
    _settingsService.setEnvironment(core);
  }

}

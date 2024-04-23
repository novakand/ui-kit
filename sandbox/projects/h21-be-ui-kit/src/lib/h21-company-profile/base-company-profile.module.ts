import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule,
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Inject, NgModule } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule, DatePipe } from '@angular/common';

// libs
import { NgSelectModule } from '@ng-select/ng-select';

// interfaces
import { ICoreEnvironment } from '../../interfaces/core-environment.interface';

// modules
import { H21ProfileImageModule } from '../h21-profile-image/h21-profile-image.module';
import { H21DialogPanelModule } from '../h21-dialog-panel/h21-dialog-panel.module';
import { H21TableLoaderModule } from '../h21-table-loader/h21-table-loader.module';
import { H21CardLoaderModule } from '../h21-card-loader/h21-card-loader.module';
import { H21DirectivesModule } from '../../directives/h21-directives.module';
import { H21HistoryModule } from '../h21-history/h21-history.module';
import { HierarchyModule } from '../h21-hierarchy/hierarchy.module';
import { H21TableModule } from '../h21-table/h21-table.module';
import { H21PipesModule } from '../../pipes/h21-pipes.module';

// components
import { CompanyInvoicingComponent } from './components/company-invoicing/company-invoicing.component';
import { HierarchyCompanyComponent } from './components/hierarchy-company/hierarchy-company.component';
import { DepartmentComponent } from './components/departments/department/department.component';
import { GeneralInfoComponent } from './components/general-info/general-info.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { ServicesComponent } from './components/services/services.component';
import { DetailsComponent } from './components/details/details.component';
import { UsersComponent } from './components/users/users.component';
import { InterfaceSettingsComponent } from './components/interface-settings/interface-settings.component';
import { PolicyComponent } from './components/policy/policy.component';

// tslint:disable
import { CompanyReferenceDialogComponent } from './components/company-references/company-reference-dialog/company-reference-dialog.component';
import { CompanyReferencesListComponent } from './components/company-references/company-references-list/company-references-list.component';
import { SuppliersDialogComponent } from "./components/suppliers/suppliers-dialog/suppliers-dialog.component";
import { SuppliersListComponent } from "./components/suppliers/suppliers-list/suppliers-list.component";
// tslint:enable

// services
import { ProfileLinkService } from '../../services/profile-link.service';
import { CompanyUserService } from './services/company-user.service';
import { SettingsService } from '../../services/settings.service';
import { DepartmentService } from './services/department.service';

// tokens
import { CORE_ENVIRONMENT } from '../h21-company-list/core-environment.token';

@NgModule({
  declarations: [
    DetailsComponent,
    GeneralInfoComponent,
    UsersComponent,
    DepartmentsComponent,
    DepartmentComponent,
    HierarchyCompanyComponent,
    ServicesComponent,
    CompanyInvoicingComponent,
    CompanyReferencesListComponent,
    CompanyReferenceDialogComponent,
    SuppliersListComponent,
    SuppliersDialogComponent,
    InterfaceSettingsComponent,
    PolicyComponent,
  ],
  providers: [
    ProfileLinkService,
    CompanyUserService,
    DepartmentService,
    DatePipe,
  ],
  imports: [
    A11yModule,
    FormsModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    H21PipesModule,
    MatChipsModule,
    H21TableModule,
    MatTableModule,
    MatInputModule,
    NgSelectModule,
    MatButtonModule,
    MatRippleModule,
    MatSelectModule,
    HierarchyModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatExpansionModule,
    H21CardLoaderModule,
    ReactiveFormsModule,
    H21TableLoaderModule,
    H21DialogPanelModule,
    MatProgressBarModule,
    H21ProfileImageModule,
    MatAutocompleteModule,
    H21HistoryModule,
    H21DirectivesModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatCheckboxModule,
    MatPaginatorModule,
  ],
  entryComponents: [
    DepartmentComponent,
    DetailsComponent,
    GeneralInfoComponent,
    UsersComponent,
    DepartmentsComponent,
    DepartmentComponent,
    HierarchyCompanyComponent,
    CompanyReferenceDialogComponent,
    SuppliersDialogComponent,
  ],
  exports: [
    DepartmentComponent,
    DetailsComponent,
    GeneralInfoComponent,
    UsersComponent,
    DepartmentsComponent,
    DepartmentComponent,
    HierarchyCompanyComponent,
    ServicesComponent,
    CompanyInvoicingComponent,
    CompanyReferencesListComponent,
    CompanyReferenceDialogComponent,
    SuppliersListComponent,
    SuppliersDialogComponent,
    InterfaceSettingsComponent,
    PolicyComponent,
  ],
})
export class BaseCompanyProfileModule {

  constructor(@Inject(CORE_ENVIRONMENT) core: ICoreEnvironment,
              _settingsService: SettingsService) {

    _settingsService.setEnvironment(core);
  }

}

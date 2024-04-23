import {
  MatButtonModule,
  MatChipsModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatSelectModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Inject, NgModule } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// interfaces
import { ICoreEnvironment } from '../../interfaces/core-environment.interface';

// services
import { ProfileLinkService } from '../../services/profile-link.service';
import { SettingsService } from '../../services/settings.service';

// tokens
import { CORE_ENVIRONMENT } from '../h21-company-list/core-environment.token';

// components
import { HierarchyFilterComponent } from './components/hierarchy-filter/hierarchy-filter.component';
import { HierarchyTreeComponent } from './components/hierarchy-tree/hierarchy-tree.component';
import { HierarchyComponent } from './components/hierarchy/hierarchy.component';

// modules
import { H21TableLoaderModule } from '../h21-table-loader/h21-table-loader.module';
import { H21DialogPanelModule } from '../h21-dialog-panel/h21-dialog-panel.module';
import { H21FilterModule } from '../h21-filter/h21-filter.module';
import { H21TableModule } from '../h21-table/h21-table.module';

@NgModule({
  declarations: [
    HierarchyFilterComponent,
    HierarchyTreeComponent,
    HierarchyComponent,
  ],
  imports: [
    A11yModule,
    FormsModule,
    RouterModule,
    CommonModule,
    MatIconModule,
    MatTabsModule,
    H21TableModule,
    MatTableModule,
    MatInputModule,
    MatChipsModule,
    H21FilterModule,
    MatButtonModule,
    MatSelectModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    H21TableLoaderModule,
    H21DialogPanelModule,
    MatProgressBarModule,
  ],
  entryComponents: [
    HierarchyFilterComponent,
    HierarchyTreeComponent,
    HierarchyComponent,
  ],
  providers: [
    ProfileLinkService,
  ],
  exports: [
    HierarchyFilterComponent,
    HierarchyTreeComponent,
    HierarchyComponent,
  ],
})
export class HierarchyModule {

  constructor(@Inject(CORE_ENVIRONMENT) core: ICoreEnvironment,
              _settingsService: SettingsService) {

    _settingsService.setEnvironment(core);
  }

}

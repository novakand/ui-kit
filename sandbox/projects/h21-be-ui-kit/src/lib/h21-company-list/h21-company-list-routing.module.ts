import { RouterModule, Routes } from '@angular/router';

// guards
import { CompaniesGuard } from '../../guards/companies.guard';

// components
import { CompanyProfileCardComponent } from './components/company-profile/company-profile-card/company-profile-card.component';
import { CompanyListComponent } from './components/company-list/company-list.component';

const routes: Routes = [
  { path: '', component: CompanyListComponent },
  { path: 'company/:id', canActivate: [CompaniesGuard], component: CompanyProfileCardComponent },
];

export const routing = RouterModule.forChild(routes);

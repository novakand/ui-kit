import { RouterModule, Routes } from '@angular/router';

import { DetailsComponent } from './components/details/details.component';

const routes: Routes = [
  { path: '', component: DetailsComponent },
];

export const routing = RouterModule.forChild(routes);

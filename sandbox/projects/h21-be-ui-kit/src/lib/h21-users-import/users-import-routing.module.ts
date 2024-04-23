import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// components
import { ImportInfoComponent } from './import-info/import-info.component';
import { UsersImportComponent } from './users-import.component';

const routes: Routes = [
  { path: '', component: UsersImportComponent },
  { path: 'info', component: ImportInfoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersImportRoutingModule { }

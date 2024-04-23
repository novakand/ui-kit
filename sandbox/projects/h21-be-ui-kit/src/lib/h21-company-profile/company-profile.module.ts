import { NgModule } from '@angular/core';

// modules
import { BaseCompanyProfileModule } from './base-company-profile.module';
// routes
import { routing } from './company-profile-routing.module';
@NgModule({
  imports: [
    routing,
    BaseCompanyProfileModule,
  ],
})
export class CompanyProfileModule { }

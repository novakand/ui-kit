import { RouterModule, Routes } from '@angular/router';
import { NgModule, Optional, SkipSelf } from '@angular/core';

import { DocsNavigationComponent } from '../docs-navigation/docs-navigation.component';
import { DocsComponent } from '../docs/docs.component';
import { AppComponent } from '../app.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'demo', component: AppComponent },
  { path: 'demo/airbe', component: AppComponent },
  { path: 'docs', component: DocsComponent },
  { path: 'style/:', component: DocsNavigationComponent },
  { path: 'components/:', component: DocsNavigationComponent },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {

  constructor (
    @Optional() @SkipSelf() parentModule: AppRoutingModule,
  ) {
    if (parentModule) {
      throw new Error('AppRoutingModule is already loaded');
    }
  }

}

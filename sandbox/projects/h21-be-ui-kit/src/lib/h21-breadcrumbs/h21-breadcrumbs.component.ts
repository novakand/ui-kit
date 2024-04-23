import { Component, Input } from '@angular/core';

import { H21BreadcrumbsLinkMode } from './h21-breadcrumbs-link-mode.enum';
import { IBreadcrumb } from './models';

@Component({
  selector: 'h21-breadcrumbs',
  templateUrl: './h21-breadcrumbs.component.html',
})
export class H21BreadcrumbsComponent {

  @Input() public lastIsLink = false;                 // specifies whether the last element should be a link
  @Input() public breadcrumbsData: IBreadcrumb[];     // an array of breadcrumbs in the form of objects { url: '', label: ''}
  @Input() public linkMode: H21BreadcrumbsLinkMode;   // the way to go by link. The possible values are 'href' and 'routerLink'

  constructor () {
    this.init();
  }

  public init() {
    this.lastIsLink = false;
    this.linkMode = H21BreadcrumbsLinkMode.RouterLink;
  }

  public showHrefLinkButton(): boolean {
    return this.linkMode === H21BreadcrumbsLinkMode.Href;
  }

  public showRouterLinkButton(): boolean {
    return this.linkMode === H21BreadcrumbsLinkMode.RouterLink;
  }

  public isLink(isLast: boolean): boolean {
    return !isLast || this.lastIsLink;
  }
  public isText(isLast: boolean): boolean {
    return isLast && !this.lastIsLink;
  }

  public trackByFn(index) {
    return index;
  }

}

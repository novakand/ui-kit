import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'h21-docs',
  templateUrl: './docs.component.html',
})
export class DocsComponent {

  public pagePath = '';
  public routeLink = '';
  public location: Location;

  constructor(location: Location) {
    this.location = location;
    this.routeLink = location.path();
  }

  public changeComponent(link: string): void {
    this.routeLink = link;
    this.location.replaceState(link);
  }

}

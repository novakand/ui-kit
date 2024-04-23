import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { ISidebarNavTab } from '../../interfaces/sidebar-nav-tab.interface';
import { ViewMode } from '../../enums';

@Component({
  selector: 'h21-sidebar-nav',
  templateUrl: './h21-sidebar-nav.component.html',
})
export class H21SidebarNavComponent {

  @Input() public selected: string;
  @Input() public disabled = false;
  @Input() public tabs: ISidebarNavTab[];
  @Input() public viewMode: ViewMode;

  @Output() public changed: EventEmitter<ISidebarNavTab> = new EventEmitter<ISidebarNavTab>();

  public viewModeType = ViewMode;

  constructor(
    private _router: Router,
  ) {
    this.viewMode = ViewMode.Collapsed;
  }

  public select(item: ISidebarNavTab): void {
    this.selected = item.name;
    this.changed.emit(item);
    item.type === 'link' && !!item.url && this._router.navigateByUrl(item.url);
    item.type === 'href' && !!item.url && (window.open(item.url, '_blank'));
  }

  public trackByFn(index) {
    return index;
  }

}

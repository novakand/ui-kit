import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

// services
import { PermissionService } from '../services/permission.service';

@Directive({
  selector: '[h21HasPermission]',
})
export class HasPermissionDirective {

  @Input()
  set h21HasPermission(name) {
    this._element = name;
    this._element && this._updateView();
  }

  private _element: string;

  constructor(private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef,
              private _permissions: PermissionService,
  ) { }

  private _updateView() {
    const hasPermissions = this._permissions.hasPermissions(this._element);
    if (hasPermissions) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

}

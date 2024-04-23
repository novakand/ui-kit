import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import { DIALOG_PANEL_COMPONENT } from './h21-dialog-panel.tokens';
import { H21DialogPanelService } from './h21-dialog-panel.service';

@Component({
  selector: 'h21-dialog-panel',
  templateUrl: './h21-dialog-panel.component.html',
})
export class H21DialogPanelComponent implements OnInit {

  @ViewChild('container', { read: ViewContainerRef }) public container: ViewContainerRef;

  public componentRef: ComponentRef<any>;

  constructor(private _service: H21DialogPanelService,
              private _resolver: ComponentFactoryResolver,
              @Inject(DIALOG_PANEL_COMPONENT) private _component: any,
  ) { }

  public ngOnInit(): void {

    if (this._component) {
      const factory = this._resolver.resolveComponentFactory(this._component);
      this.componentRef = this.container.createComponent(factory);
    }
  }

}

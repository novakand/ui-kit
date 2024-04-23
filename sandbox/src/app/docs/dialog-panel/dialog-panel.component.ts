import { Component } from '@angular/core';

import { H21DialogPanelService, H21ProfileImageComponent } from '../../../../projects/h21-be-ui-kit/src/lib';

@Component({
  selector: 'h21-dialog-panel-docs',
  templateUrl: './dialog-panel.component.html',
})
export class DialogPanelComponent {

  public title = 'Компонент Dialog Panel';

  constructor(private _service: H21DialogPanelService) { }

  public create(): void {
    this._service.open(H21ProfileImageComponent, { data: 'test' });
  }

}

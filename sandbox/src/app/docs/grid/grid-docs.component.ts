import { Component } from '@angular/core';

import { H21DefaultDialogService } from '../../../../projects/h21-be-ui-kit/src/lib/dialogs';

@Component({
  selector: 'h21-grid-docs',
  templateUrl: './grid-docs.component.html',
})
export class GridDocsComponent {

  public title = 'Grid';

  constructor(private dialogs: H21DefaultDialogService) { }

  public showConfirm() {
    this.dialogs
      .confirm('Confirm', 'Are you ready?')
      .afterClosed()
      .subscribe((e) => { });
  }

  public showError() {
    this.dialogs
      .error('Error', 'You are not ready!');
  }

}

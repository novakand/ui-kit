import { OverlayRef } from '@angular/cdk/overlay';

// enums
import { PanelAction } from '../../../../enums/panel-action.enum';
import { ViewMode } from '../../../../enums/view-mode.enum';

export class PaymentMethodDialogData {

  public id: number;
  public stateId: number;
  public companyId: number;
  public paymentTypeId: number;
  public paymentTypeName: string;

  public overlay: OverlayRef;
  public action: PanelAction;
  public mode: ViewMode;

  constructor(obj: Partial<PaymentMethodDialogData>) {
    Object.assign(this, obj);
  }

}

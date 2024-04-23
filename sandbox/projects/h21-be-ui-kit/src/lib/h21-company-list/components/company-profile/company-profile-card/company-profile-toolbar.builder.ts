// components
import { CompanyProfileCardComponent } from './company-profile-card.component';

// models
import { IToolbarActionButton } from '../../../../h21-top-toolbar/models';

// enums
import { ProfileCardMode } from '../../../../../enums';

// @dynamic
export class CompanyProfileToolbarBuilder {

  public static build(component: CompanyProfileCardComponent): IToolbarActionButton[] {
    return [
      {
        name: 'save',
        tooltipText: 'Save',
        icon: 'save',
        action: () => component.save(),
        visible: component.mode !== ProfileCardMode.view,
      },
      {
        name: 'cancel',
        disabled: false,
        tooltipText: 'Cancel',
        icon: 'undo',
        action: () => component.cancel(),
        visible: component.mode !== ProfileCardMode.view,
      },
      {
        name: 'edit',
        disabled: component.mode !== ProfileCardMode.view,
        tooltipText: 'Edit',
        icon: 'edit',
        action: () => component.setEditMode(),
        visible: component.isAdmin && component.mode !== ProfileCardMode.add && component.isEditableVersion(),
      },
      {
        name: 'publish',
        disabled: false,
        tooltipText: 'Publish',
        icon: 'cloud_upload',
        action: () => component.publish(),
        visible: component.isAdmin && component.canPublish(),
      },
    ];
  }

}

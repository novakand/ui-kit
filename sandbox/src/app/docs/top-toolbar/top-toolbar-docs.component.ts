import { Component } from '@angular/core';

import { IBreadcrumb } from '../../../../projects/h21-be-ui-kit/src/lib/h21-breadcrumbs/models';
import { H21TopToolbarService } from '../../../../projects/h21-be-ui-kit/src/services';
import { IToolbarActionButton } from '../../../../projects/h21-be-ui-kit/src/lib';

const BREADCRUMBS_DATA: IBreadcrumb[] = [
  { label: 'Home', url: '#' },
  { label: 'Company', url: '#' },
  { label: 'My Company', url: '#' },
  { label: 'My User', url: '#' },
];

const ACTION_BUTTONS: IToolbarActionButton[] = [
  {
    name: 'edit',
    disabled: false,
    tooltipText: 'Edit',
    icon: 'edit',
    cssClass: 'toolbar-action-btn',
    action: () => { },
  },
  {
    name: 'updateCard',
    disabled: true,
    tooltipText: 'Update user-profile-card',
    icon: 'autorenew',
    cssClass: 'toolbar-action-btn',
  },
  {
    name: 'confirmEmail',
    disabled: true,
    tooltipText: 'Сonfirm email address',
    icon: 'email',
    cssClass: 'toolbar-action-btn',
  },
  {
    name: 'changePassword',
    disabled: true,
    tooltipText: 'Change password',
    icon: 'vpn_key',
    cssClass: 'toolbar-action-btn',
  },
  {
    name: 'blockUser',
    disabled: false,
    tooltipText: 'Block user-profile',
    icon: 'block',
    cssClass: 'toolbar-action-btn__hover-red',
  },
];

@Component({
  selector: 'h21-top-toolbar-docs',
  templateUrl: './top-toolbar-docs.component.html',
})
export class TopToolbarDocsComponent {

  public title = 'Top toolbar component';
  public breadcrumbs: IBreadcrumb[] = BREADCRUMBS_DATA;

  constructor(private toolbarService: H21TopToolbarService) {
    this.toolbarService.actions = ACTION_BUTTONS;
  }

  public actionBtnClick(e: IToolbarActionButton): void { }

 }

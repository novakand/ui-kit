import { Component } from '@angular/core';
import { IH21Notification } from '../../../../projects/h21-be-ui-kit/src/models';
import { IUserCardAction } from '../../../../projects/h21-be-ui-kit/src/lib/h21-user-profile-panel/models';
import { H21WhiteLabelService } from '../../../../projects/h21-be-ui-kit/src/lib/h21-white-label/h21-white-label.service';
import { H21WhiteLabelRef } from '../../../../projects/h21-be-ui-kit/src/lib/h21-white-label/h21-white-label-ref';
import { H21DefaultDialogService, IconType } from '../../../../projects/h21-be-ui-kit/src/lib/dialogs';

const NOTIFICATIONS: IH21Notification[] = [
  { text: 'Notification 1', icon: 'notifications_active', isUnread: true },
  { text: 'Notification 2', icon: 'notifications_active', isUnread: true },
  { text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' +
      ' Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s', icon: 'notifications_active', isUnread: true },
  { text: 'Notification 4', icon: 'notifications_none', isUnread: false },
  { text: 'Notification 5', icon: 'notifications_none', isUnread: false },
  { text: 'Notification 6', icon: 'notifications_none', isUnread: false },
  { text: 'Notification 7', icon: 'notifications_none', isUnread: false },
  { text: 'Notification 8', icon: 'notifications_none', isUnread: false },
  { text: 'Notification 9', icon: 'notifications_none', isUnread: false },
  { text: 'Notification 10', icon: 'notifications_none', isUnread: false, createDate: {
        date: '2018-03-07',
        time: '22:52:17',
        year: 2018,
        month: 3,
        day: 7,
        hour: 22,
        minute: 52,
        second: 17,
      },
    },
];

const actionsConst: IUserCardAction[] = [
  {
    name: 'whiteLabel',
    label: 'White label',
    icon: 'format_color_fill',
    disabled: false,
    visibility: true,
  },
  {
    name: 'routeLink',
    label: 'Route link',
    icon: 'link',
    route: 'test_link',
    isLink: true,
    visibility: true,
  },
];

@Component({
  selector: 'h21-header-docs',
  templateUrl: './header-docs.component.html',
})
export class HeaderDocsComponent {

  public title = 'Header';
  public notificationCount: number;
  public notifications: IH21Notification[];
  public actions: IUserCardAction[];
  private _whiteLabelDialogRef: H21WhiteLabelRef;

  constructor(private _whiteLabelDialog: H21WhiteLabelService,
              private _dialogConfirm: H21DefaultDialogService) {
    this.notificationCount = 3;
    this.notifications = NOTIFICATIONS;
    this.actions = actionsConst;
  }

  public onAction(action: string): void {
    if (action === 'whiteLabel') {
      this.openWhiteLabelDialog();
    }
  }

  public openWhiteLabelDialog(): void {
    this._whiteLabelDialogRef = this._whiteLabelDialog.open();
    this._whiteLabelDialogRef.afterClosed()
      .subscribe((data) => { });
  }

  public confirmOpen() {
    this._dialogConfirm.confirm('Delete operation', 'Do you really want to delete?');
  }

  public messageOpen(num: number) {
    if (num === 1) {
      this._dialogConfirm.message('Message title', 'Message text.', IconType.Success);
    }
    if (num === 2) {
      this._dialogConfirm.message('Message title', 'Message text.', IconType.Warning);
    }
    if (num === 3) {
      this._dialogConfirm.message('Message title', 'Message text.', IconType.Question);
    }
    if (num === 4) {
      this._dialogConfirm.message('Message title', 'Message text.', IconType.Error);
    }
    if (num === 5) {
      this._dialogConfirm.message('Message title', 'Message text.', IconType.Stop);
    }
    if (num === 6) {
      this._dialogConfirm.message('Message title', 'Message text.', IconType.Info);
    }

  }

  public onOpen() { }

  public onClose() { }

}

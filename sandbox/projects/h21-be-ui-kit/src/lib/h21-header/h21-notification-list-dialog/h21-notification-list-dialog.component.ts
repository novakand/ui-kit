import { Component, EventEmitter, Inject } from '@angular/core';

import { NotificationListDialogAnimation } from '../../../animations/h21-notification-list-dialog';
import { H21NotificationListDialogRef } from './h21-notification-list-dialog-ref';
import { IH21Notification } from '../../../models/i-h21-notification';
import { DIALOG_DATA } from './h21-notification-list-dialog.tokens';

@Component ({
  selector: 'h21-notification-list-dialog',
  templateUrl: './h21-notification-list-dialog.component.html',
  animations: NotificationListDialogAnimation,
})
export class H21NotificationListDialogComponent {

  public animationState: 'void' | 'enter' | 'leave' = 'enter';
  public animationStateChanged = new EventEmitter<AnimationEvent>();
  public title: string;
  public notifications: IH21Notification[];

  constructor(public dialogRef: H21NotificationListDialogRef,
              @Inject(DIALOG_DATA) _notifications: IH21Notification[],
  ) {
    this.notifications = _notifications;
    this.title = 'Notifications';
  }

  public trackByFn(index) {
    return index;
  }

  public onAnimationStart(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  public onAnimationDone(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  public startExitAnimation(): void {
    this.animationState = 'leave';
  }

  public close(): void {
    this.dialogRef.close();
  }

}

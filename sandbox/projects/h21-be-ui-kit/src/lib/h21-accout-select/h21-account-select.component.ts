import { Component, EventEmitter, Inject } from '@angular/core';

import { AccountSelectAnimation } from '../../animations/h21-account-select';
import { ACCOUNTS_DIALOG_DATA } from './h21-accounts-select.tokens';
import { H21AccountSelectRef } from './h21-account-select-ref';

@Component ({
  selector: 'h21-account-select',
  templateUrl: './h21-account-select.component.html',
  animations: AccountSelectAnimation,
})
export class H21AccountSelectComponent {

  public animationState: 'void' | 'enter' | 'leave' = 'enter';
  public animationStateChanged = new EventEmitter<AnimationEvent>();
  public selectedAccount: any;

  constructor (public dialogRef: H21AccountSelectRef,
               @Inject(ACCOUNTS_DIALOG_DATA) public accounts: any,
  ) {
    this.selectedAccount = accounts[0];
  }

  public trackByFn(index) {
    return index;
  }

  public changeSelectionAccount(id: number): void {
    const index = this.accounts.findIndex((item) => item.id === id);
    this.selectedAccount = this.accounts[index];
  }

  public close(): void {
    this.dialogRef.close(null);
  }

  public returnDialog(): void {
    this.dialogRef.close(this.selectedAccount);
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

}

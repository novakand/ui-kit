import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { IUserCardData } from './models';

@Component ({
  selector: 'h21-user-card',
  templateUrl: './h21-user-card.component.html',
  styleUrls: ['./h21-user-card.component.css'],
})
export class H21UserCardComponent {

  @Input() public data: IUserCardData;
  @Input() public hasValidToken: boolean;

  @Output() public logout: EventEmitter<void> = new EventEmitter();
  @Output() public action: EventEmitter<string> = new EventEmitter();

  public onAction(actionName: string): void {
    this.action.emit(actionName);
  }

  public onLogout(): void {
    this.logout.emit();
  }

  public trackByFn(index) {
    return index;
  }

}

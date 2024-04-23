import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[h21EnterPressed]',
})
export class H21EnterPressedDirective {

  @Output() public pressed = new EventEmitter<undefined>();

  @HostListener('document:keyup.enter') public onKeydownHandler() {
    this.pressed.emit();
  }

}

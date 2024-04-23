import { DomSanitizer } from '@angular/platform-browser';
import { Component, EventEmitter } from '@angular/core';
import { MatIconRegistry } from '@angular/material';

import { RightOverlayPanelAnimation } from '../../animations/h21-right-overlay-panel';
import { H21RightOverlayPanelRef } from './h21-right-overlay-panel-ref';

@Component ({
  selector: 'h21-right-overlay-panel',
  templateUrl: './h21-right-overlay-panel.component.html',
  animations: RightOverlayPanelAnimation,
})
export class H21RightOverlayPanelComponent {

  public componentType: string;
  public animationState: 'void' | 'enter' | 'leave' = 'enter';
  public animationStateChanged = new EventEmitter<AnimationEvent>();

  constructor(public sanitizer: DomSanitizer,
              public iconReg: MatIconRegistry,
              public dialogRef: H21RightOverlayPanelRef,
  ) {
    iconReg.addSvgIcon('h21_back_to_list', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-back-to-list-gray.svg'));
  }

  public close(): void {
    this.dialogRef.close();
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

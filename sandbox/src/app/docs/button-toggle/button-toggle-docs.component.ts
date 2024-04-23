import { Component, OnInit } from '@angular/core';

import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/prism';

declare var Prism;

@Component({
  selector: 'h21-button-toggle-docs',
  templateUrl: './button-toggle-docs.component.html',
})
export class ButtonToggleDocsComponent implements OnInit {

  public title = 'Button toggle';

  public confShowDivider = true;
  public confColor: String = '';
  public confSize: String = '';
  public confWidth: String = '';
  public confDisable = false;
  public confVerticalOrientation = false;
  public confCodeSample: String = '';

  public ngOnInit() {
    this.updateCodeSample();
  }

  public updateCodeSample() {
    this.confCodeSample = this.highlightCode(this.getCodeSample());
  }

  public getCodeSample(): String {
    const attrClassCode = this.confColor || this.confSize || this.confWidth ?
      ` class="${this.confSize}${this.confSize && this.confColor ? ' ' : ''}`
      + `${this.confColor}${(this.confColor || this.confSize) && this.confWidth ? ' ' : ''}${this.confWidth}"` :
      '';
    const code = `
      <mat-button-toggle-group${attrClassCode}${this.confDisable ?
      ' [disabled]="true"' : ''}${this.confVerticalOrientation ? ' [vertical]="true"' : ''}>
          <mat-button-toggle value="1" [checked]="true">Button 1</mat-button-toggle>${this.confShowDivider ? this.confVerticalOrientation ?
      '\n    <mat-divider></mat-divider>' : '\n    <mat-divider [vertical]="true"></mat-divider>' : ''}
          <mat-button-toggle value="2" [checked]="true">Button 2</mat-button-toggle>${this.confShowDivider ? this.confVerticalOrientation ?
      '\n    <mat-divider></mat-divider>' : '\n    <mat-divider [vertical]="true"></mat-divider>' : ''}
          <mat-button-toggle value="3" [checked]="true">Button 3</mat-button-toggle>${this.confShowDivider ? this.confVerticalOrientation ?
      '\n    <mat-divider></mat-divider>' : '\n    <mat-divider [vertical]="true"></mat-divider>' : ''}
          <mat-button-toggle value="4" [checked]="true">Button 4</mat-button-toggle>
      </mat-button-toggle-group>`;
    return code.trim();
  }

  public highlightCode(code: String): String {
    return Prism.highlight(code, Prism.languages.html);
  }

}

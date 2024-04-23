import { Component, OnInit } from '@angular/core';

import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/prism';

declare var Prism;

@Component({
  selector: 'h21-buttons-docs',
  templateUrl: './buttons-docs.component.html',
})
export class ButtonsDocsComponent implements OnInit {

  public title = 'Buttons';
  public confType: String = 'mat-button';

  public confSize: String = '';
  public confColor: String = '';
  public confCodeSample: String = '';

  public confDisable = false;

  public ngOnInit() {
    this.updateCodeSample();
  }

  public updateCodeSample() {
    this.confCodeSample = this.highlightCode(this.getCodeSample());
  }

  public getCodeSample(): String {
    return `<button ${this.confType}${this.confColor !== ''
      ? ` color="${this.confColor}"` : ''}${this.confSize !== ''
      ? ` class="${this.confSize}"` : ''}${this.confDisable ? ' disabled' : ''}>Button</button>`;
  }

  public highlightCode(code: String): String {
    return Prism.highlight(code, Prism.languages.html);
  }

}

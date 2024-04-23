import { AfterViewInit, Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs/index';
import { Observable } from 'rxjs';

import * as Prism from 'prismjs';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';

@Component({
  selector: 'h21-docs-example-viewer',
  templateUrl: './docs-example-viewer.component.html',
})

export class DocsExampleViewerComponent implements AfterViewInit {

  @Input() public title: string;
  @Input() public pathToHtml: string;
  @Input() public pathToTs: string;
  @Input() public pathToCss: string;

  public viewExampleCode = false;
  public codeHtml = '';
  public codeTs = '';
  public codeCss = '';

  private static _highlightCode(code: string, lang: string = 'HTML'): string {
    if (code) {
      switch (lang) {
        case 'TS':
          return Prism.highlight(code, Prism.languages.typescript);
        case 'CSS':
          return Prism.highlight(code, Prism.languages.css);
        default :
          return Prism.highlight(code, Prism.languages.html);
      }
    }
    return '';
  }

  constructor(private _http: HttpClient) {
  }

  public ngAfterViewInit() {
    if (this.pathToHtml) {
      this.getContent(this.pathToHtml, 'HTML');
    }
    if (this.pathToTs) {
      this.getContent(this.pathToTs, 'TS');
    }
    if (this.pathToCss) {
      this.getContent(this.pathToCss, 'CSS');
    }
  }

  public getContent(path: string, lang: string = 'HTML') {
    lang = lang.toUpperCase();
    this._getRemoteContent(path).subscribe((data) => {
      switch (lang) {
        case 'TS':
          this.codeTs = DocsExampleViewerComponent._highlightCode(data, 'TS');
          break;
        case 'CSS':
          this.codeCss = DocsExampleViewerComponent._highlightCode(data, 'CSS');
          break;
        default :
          this.codeHtml = DocsExampleViewerComponent._highlightCode(data, 'Html');
      }
    });
  }

  public viewExampleCodeToggle() {
    this.viewExampleCode = !this.viewExampleCode;
  }

  private _getRemoteContent(path: string): Observable<any> {
    return this._http.get(path, { responseType: 'text' })
      .pipe(map((res) => res)).pipe(catchError(this._handleError));
  }

  private _handleError(error: any): any {
    let errMsg: string;
    if (error instanceof fetch) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return throwError(errMsg);
  }

}

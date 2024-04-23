import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'h21-typography-docs',
  templateUrl: './typography-docs.component.html',
})
export class TypographyDocsComponent {

  public title = 'Typography';
  public isDataInit = false;

  public colorsFg: any[] = [];
  public cssModifiers: any[] = [];

  constructor(private _http: HttpClient) {
    this._http.get<any>('./assets/storage/colors.json')
      .subscribe({
        next: (data) => {
          this.colorsFg = data.foreground;
          this.isDataInit = true;
        },
      });

    this._http.get<any>('./assets/storage/typography.json')
      .subscribe({
        next: (data) => {
          this.cssModifiers = data.modifiers;
          this.isDataInit = true;
        },
      });
  }

  public trackByFn(index) {
    return index;
  }

}

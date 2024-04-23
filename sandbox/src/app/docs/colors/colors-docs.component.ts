import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'h21-colors-docs',
  templateUrl: './colors-docs.component.html',
})
export class ColorsDocsComponent {

  public title = 'Colors';
  public isDataInit = false;

  public colorsBg: any[] = [];
  public colorsFg: any[] = [];
  public colorsUi: any[] = [];

  constructor(private _http: HttpClient) {
    this._http.get<any>('./assets/storage/colors.json')
      .subscribe({
        next: (data) => {
          this.colorsUi = data.ui;
          this.colorsFg = data.foreground;
          this.colorsBg = data.background;
          this.isDataInit = true;
        },
      });
  }

  public trackByFn(index) {
    return index;
  }

}

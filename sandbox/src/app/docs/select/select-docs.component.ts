import { Component } from '@angular/core';

@Component({
  selector: 'h21-select-docs',
  templateUrl: './select-docs.component.html',
})
export class SelectDocsComponent {

  public title = 'Select';

  public valuePost: any;
  public valueGet: any = 'NOK';
  public valueLocal: any;
  public valueLocal2: number = null;

  public list = [];
  public list2: number[] = [];

  constructor() {
    for (let i = 0; i < 100; i++) {
      this.list.push({ id: i, code: `${i}0`, name: `name ${i}`, icon:  i % 3 === 0 ? 'location_on' : 'flight', detail: i + 10 });
      this.list2.push(i);
    }
    this.valueLocal = this.list[10];
  }

  public toStr(obj : any): string {
    return JSON.stringify(obj);
  }

}

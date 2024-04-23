import { Component } from '@angular/core';

@Component({
  selector: 'h21-autocomplete-docs',
  templateUrl: './autocomplete-docs.component.html',
})
export class AutocompleteDocsComponent {

  public title = 'Autocomplete';

  public valuePost: any;
  public valueGet: any;
  public valueLocal: any;

  public list = [];

  constructor() {
    for (let i = 0; i < 100; i++) {
      this.list.push({ id: i, code: `${i}0`, name: `name ${i}`, icon:  i % 3 === 0 ? 'location_on' : 'flight', detail: i + 10 });
    }
  }

  public toStr(obj : any): string {
    return JSON.stringify(obj);
  }

  public dataProcess(item: any): any {
    if (!item) {
      return item;
    }

    item.name = `1. ${item.name}`;
    return item;
  }

}

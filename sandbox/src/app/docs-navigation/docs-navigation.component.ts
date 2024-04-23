import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'h21-docs-navigation',
  templateUrl: './docs-navigation.component.html',
})

export class DocsNavigationComponent {

  @Output() public changeComponent: EventEmitter<string> = new EventEmitter<string>();

  public panelOpenState: boolean;
  public docsPagePath = '';

  public onChangeComponent(event): void {
    event.stopPropagation();
    const target = event.target || event.srcElement || event.currentTarget;
    let hrefAttr = target.attributes.href;
    if (!hrefAttr) {
      hrefAttr = target.parentElement.attributes.href;
    }
    const link = hrefAttr.nodeValue;
    this.changeComponent.emit(link);
  }

  public getEmitter(): EventEmitter<String> {
    return this.changeComponent;
  }

}

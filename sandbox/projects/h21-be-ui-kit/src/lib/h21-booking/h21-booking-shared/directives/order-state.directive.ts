import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({ selector: '[h21OrderState]' })
export class OrderStateDirective implements AfterViewInit {

  @Input('h21OrderState') public stateName: string;

  constructor(private _elementRef: ElementRef,
              private _renderer: Renderer2) { }

  public ngAfterViewInit(): void {
    const stateClass = this._getStateCSSClass();
    this._renderer.addClass(this._elementRef.nativeElement, stateClass);
  }

  private _getStateCSSClass(): string {
    return `c-bookings-list_chip__${this._getStateClassNameSuffix(this.stateName)}`;
  }

  private _getStateClassNameSuffix(stateName: string) {
    if (!!!stateName) { return stateName; }
    return stateName.replace(' ', '-').toLowerCase();
  }

}

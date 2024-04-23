import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'h21-start-page',
  templateUrl: './h21-start-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class H21StartPageComponent {

  constructor(private _router: Router) { }

  public navigate(url: string): void {
    this._router.navigateByUrl(url);
  }

}

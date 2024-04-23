import { Component, Input } from '@angular/core';

@Component({
  selector: 'h21-in-development',
  templateUrl: './h21-in-development.component.html',
})
export class H21InDevelopmentComponent {

  @Input() public text = 'This service is currently under development';

}

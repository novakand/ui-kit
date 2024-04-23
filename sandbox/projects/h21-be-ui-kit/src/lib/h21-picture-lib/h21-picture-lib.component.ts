import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PictureType } from './picture-type.enum';

@Component({
  selector: 'h21-picture-lib',
  templateUrl: './h21-picture-lib.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class H21PictureLibComponent {

  public pictureTypes = PictureType;
  @Input() public pictureType: PictureType;

  constructor() { }

}

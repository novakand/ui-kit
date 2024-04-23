import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'h21-slide-carousel-dialog',
  template: `
	<div>
		<img src="{{ url }}" alt="" />
	</div>
	`,
})
export class H21SlideCarouselDialogComponent {

  public url = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<H21SlideCarouselDialogComponent>) {
    this.url = data.imgUrl;
  }

}

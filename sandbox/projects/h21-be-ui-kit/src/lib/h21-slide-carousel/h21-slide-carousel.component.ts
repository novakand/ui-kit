import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material';

import { H21SlideCarouselDialogComponent } from './h21-slide-carousel-dialog.component';
import { IPicture } from '../../interfaces/picture.interface';

@Component({
  selector: 'h21-slide-carousel',
  templateUrl: './h21-slide-carousel.component.html',
})
export class H21SlideCarouselComponent implements AfterViewInit, OnInit, AfterViewChecked {

  @Input() public slideCount = 5;
  @Input() public showNavButtons = true;
  @Input() public picturesCollection: IPicture[];

  @ViewChild('H21SlideCarousel') public carousel: ElementRef;

  private _totalSlideCount = 1;

  private _viewPortWidth = 0;
  private _slideWidth = 0;

  private _currentTranslation = 0;
  private _currentIndex = 0;

  constructor (private _renderer: Renderer2,
               public dialog: MatDialog,
  ) { }

  public ngOnInit() {
    this._totalSlideCount = this.picturesCollection.length;
    this.slideCount = this.slideCount > this.picturesCollection.length
      ? this.picturesCollection.length
      : this.slideCount;
  }

  public ngAfterViewInit() {
    const element = document.getElementById('H21SC_view_port');
    if (element) {
      this.init();
    }
  }

  public ngAfterViewChecked() {
    if (this._viewPortWidth && this.carousel.nativeElement.clientWidth) {
      if (this._viewPortWidth !== this.carousel.nativeElement.clientWidth) {
        this.init();
      }
    }
  }

  public trackByFn(index) {
    return index;
  }

  public init(): void {
    this._totalSlideCount = this.picturesCollection.length;
    const element = document.getElementById('H21SC_view_port');

    this._viewPortWidth = element.clientWidth;
    this._slideWidth = this._viewPortWidth / this.slideCount;
    this._currentTranslation = this._currentIndex * this._slideWidth;

    const slides = element.children[0].children;

    for (const slide of Array.from(slides)) {
      this._renderer.setStyle(slide, 'width', `${this._slideWidth}px`);
    }

    this._moveSlide();
  }

  public prevSlide() {
    this._currentIndex--;
    this._moveSlide();
  }

  public nextSlide() {
    this._currentIndex++;
    this._moveSlide();
  }

  public showLargeImg(url: string): void {
    this.dialog.open(H21SlideCarouselDialogComponent, {
      panelClass: 'c-h21-slide-carousel_dialog',
      backdropClass: 'c-h21-slide-carousel_dialog-backdrop',
      data: {
        imgUrl: url,
      },
    });
  }

  public prevPossibility(): boolean {
    return this._currentIndex > 0;
  }

  public nextPossibility(): boolean {
    return this._currentIndex <= (this._totalSlideCount - this.slideCount - 1);
  }

  private _moveSlide() {
    const element = document.getElementById('H21SC_slides_set');
    this._currentTranslation = this._currentIndex * this._slideWidth;
    this._renderer.setStyle(element, 'transform', `translateX(${String(-this._currentTranslation)})px)`);
  }

}

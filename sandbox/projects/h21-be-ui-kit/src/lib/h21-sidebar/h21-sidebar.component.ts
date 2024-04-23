import {
  Component,
  HostListener,
  OnInit,
  ViewChildren
} from '@angular/core';

import { H21AirSearchResultComponent } from '../h21-air-search-result/h21-air-search-result.component';
import { AppSubscriberService } from '../../services/app-subscriber-service';
import { VocabularyService } from '../../services/vocabulary-service';

@Component({
  selector: 'h21-sidebar',
  templateUrl: './h21-sidebar.component.html',
})
export class H21SidebarComponent implements OnInit {

  public visibility = true;
  public actionInProcess = false;
  public activeTab = 'tab-search';
  public searchResultVisibility = false;

  @ViewChildren(H21AirSearchResultComponent) private queryResultPanels: H21AirSearchResultComponent;

  private _screenWidth: number;

  constructor(private _vocabulary: VocabularyService,
              private _appSubscriber: AppSubscriberService) {
    this.onResize();
  }

  @HostListener('window:resize', ['$event']) public onResize(event?) {
    this._screenWidth = window.innerWidth;
  }

  public ngOnInit(): void {
    this._appSubscriber.searchResultModeObservable()
      .subscribe({
        next: (mode) => {
          if (mode === 'list' || mode === 'grid' || mode === 'full-width-list') {
            this._showSearchResult();
          } else if (mode === 'map')  {
            this._hideSearchResult();
          }
        },
      });
  }

  public visibilityToggle(): void {
    if (this.visibility) {
      this.visibilityHide();
    } else {
      this.visibilityShow();
    }
  }

  public visibilityShow(): void {
    this.visibility = true;
    this.activeTab = 'tab-search';
  }

  public visibilityHide(): void {
    this.visibility = false;
    this.activeTab = '';
  }

  public searchResultVisibilityToggle(): void {
    if (!this.searchResultVisibility) {
      this._showSearchResult();
    } else {
      this._hideSearchResult();
    }
  }

  private _showSearchResult() {
    this.searchResultVisibility = true;
  }

  private _hideSearchResult() {
    this.searchResultVisibility = false;
  }

}

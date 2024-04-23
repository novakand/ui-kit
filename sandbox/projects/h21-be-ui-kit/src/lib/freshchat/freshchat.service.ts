import { Inject, Injectable, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';

import {
  IFreshChatConfig,
  IFreshChatInitOptions,
  IFreshChatOpenOptions,
  IFreshChatUserProperties,
} from './freshchat.interfaces';
import { H21ThemeElementsService } from '../h21-white-label/services/h21-theme-elements.service';
import { H21StorageThemeService } from '../h21-white-label/services/h21-storage-theme.service';
import { FRESHCHAT_INIT_OPTIONS } from './freshchat.providers';
import { LoaderService } from '../../services/loader.service';
import { throwFreshChatNotExist } from './freshchat.errors';

@Injectable({ providedIn: 'root' })
export class FreshChatService implements OnDestroy {

  private _widget: any;

  private _countUnreadMessages = 0;

  private _opened$ = new Subject<void>();
  private _closed$ = new Subject<void>();
  private _loaded$ = new Subject<void>();
  private _downloaded$ = new Subject<void>();
  private _messageReceived$ = new Subject<number>();

  private _bgProperty = 'Header background color';

  constructor(private _loader: LoaderService,
              private _theme: H21StorageThemeService,
              private _elements: H21ThemeElementsService,
              @Inject(FRESHCHAT_INIT_OPTIONS) private _initialOptions: IFreshChatInitOptions) {
    this._updateIfThemeChanged();
  }

  get loaded$(): Observable<void> { return this._loaded$.asObservable(); }

  get downloaded$(): Observable<void> { return this._downloaded$.asObservable(); }

  get opened$(): Observable<void> { return this._opened$.asObservable(); }

  get closed$(): Observable<void> { return this._closed$.asObservable(); }

  get messageReceived$(): Observable<number> { return this._messageReceived$.asObservable(); }

  public ngOnDestroy() {
    this.destroy();

    this._opened$.complete();
    this._closed$.complete();
    this._loaded$.complete();
    this._messageReceived$.complete();
  }

  public init(config?: IFreshChatInitOptions) {
    const initOptions = { ...this._initialOptions, ...config };
    this._widget.init(initOptions);
    this._downloaded$.complete();
  }

  public destroy() {
    this._widget && this._widget.destroy();
  }

  public open(options?: IFreshChatOpenOptions) {
    this._widget.open(options);
  }

  public close() {
    this._widget.close();
  }

  public setConfig(config: IFreshChatConfig) {
    this._widget.setConfig(config);
  }

  public setUser(user: IFreshChatUserProperties) {
    this._widget.user.setProperties(user);
  }

  public clearUser() {
    this._widget.user.clearUser();
  }

  public load(): void {
    this._loader.loadScript('https://wchat.freshchat.com/js/widget.js')
      .pipe(first())
      .subscribe({
        next: () => {
          this._widget = (<any>window).fcWidget;
          if (!this._widget) { throwFreshChatNotExist(); }
          this._initEvents();

          this._downloaded$.next();
        },
      });
  }

  private _initEvents() {
    this._widget.on('widget:loaded', () => this._loaded$.next());
    this._widget.on('widget:opened', () => this._opened$.next());
    this._widget.on('widget:closed', () => this._closed$.next());
    this._widget.on('unreadCount:notify', (count) => {
      this._countUnreadMessages = count;
      this._messageReceived$.next(count);
    });
  }

  private _updateIfThemeChanged(): void {
    this._theme.themeChanged
      .subscribe({
        next: (theme) => {
          const element = this._elements.getValueByElement(theme, this._bgProperty);
          if (element) {
            const config = {
              config: {
                headerProperty: {
                  backgroundColor: element.colorHexCode,
                  foregroundColor: element.contrastHexCode,
                  hideChatButton: true,
                  direction: 'ltr',
                },
              },
            };
            this._initialOptions = { ...this._initialOptions, ...config };
          }
        },
      });
  }

}

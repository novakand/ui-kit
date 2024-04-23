import { Injectable, OnDestroy } from '@angular/core';

import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { ReplaySubject } from 'rxjs';

import { ISignalrContext } from '../interfaces/signalr-context.interface';
import { SettingsService } from './settings.service';

@Injectable()
export class SignalrService implements OnDestroy {

  protected hubConnection: HubConnection;

  public contextResolved = new ReplaySubject<boolean>(1);

  private _context: ISignalrContext;

  private _hubPromise: Promise<HubConnection>;
  private _hubResolver: (value?: HubConnection) => void;

  constructor(private _settings: SettingsService) {
    this._hubPromise = new Promise<HubConnection>(
      (resolve: () => void) => {
        this._hubResolver = resolve;
      });

    this.init();
  }

  public init(): void {
    if (!this._settings.environment.signalrUrl) {
      return;
    }

    this._createConnection();
    this.on('init', (data) => {
      this._context = data;
      this.contextResolved.next(true);
    });

    this.setListener();
    this._startConnection();
  }

  get context(): ISignalrContext {
    return this._context;
  }

  public on(method: string, callback: any): void {
    this.hubConnection
      .on(method, callback);
  }

  public invoke(method: string, ...data: string[]): Promise<any> {
    const args = [method].concat(data);

    return this._hubPromise.then((connection) => {
      connection.invoke.apply(connection, args);
    });
  }

  public ngOnDestroy(): void {
    try {
      this.hubConnection.stop();
    } catch (error) {

    }
  }

  protected setListener(): void { }

  private _createConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this._settings.environment.signalrUrl)
      .build();
  }

  private _startConnection(): void {
    this.hubConnection
      .start()
      .then(() => {
        this._hubResolver(this.hubConnection);

        this.hubConnection.invoke('Init');
      })
      .catch(() => {
        setTimeout(() => this._startConnection(), 15000);
      });
  }

}

import { Application } from '../enums/application.enum';

export interface ICoreEnvironment {
  application?: Application;
  target?: string;
  clientRootUrl?: string;
  apiRootUrl?: string;
  identityUrl?: string;
  signalrUrl?: string;
  referencesUrl?: string;
  fileStorageUrl?: string;
  fileStorageClientUrl?: string;
  reportUrl?: string;
  authClientId?: string;
  authScope?: string;
  httpTimeout?: number;
  profileApi?: string;
  connectorApi?: string;
  transferApi?: string;
  appsApi?: string;
  dashboardUrlUri?: string;
}

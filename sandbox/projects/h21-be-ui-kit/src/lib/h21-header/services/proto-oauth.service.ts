import { Injectable } from '@angular/core';
import {
  LoginOptions,
  OAuthService,
  OidcDiscoveryDoc,
  ValidationParams,
} from 'angular-oauth2-oidc';

const user = {
  sub: 'a52d7810-4e06-4fc6-8bd7-704ef3679951',
  auth_time: 1547797544,
  idp: 'local',
  amr: 'pwd',
  'AspNet.Identity.SecurityStamp': 'RJ66L2MQA3F6KJQ2TC2Z53QSUO6THSI3',
  email: 'akushkunov@horse21.net',
  given_name: 'Ahmed',
  family_name: 'M',
  middle_name: 'Kushkunov',
  locale: 'ru-RU',
  gender: 'male',
  phone_number: '932871-8937450-',
  birthdate: '2039-07-22T21:00:00.0000000',
  picture: '00961E6BB6F16C779D8AEE00B5412BD1',
  update_date: '2018-12-10T17:53:43.9061340',
  registration_date: '2018-11-29T14:07:48.3986750',
  company_name: '777',
  h21pro_user_id: '8724',
  user_profile_id: '19',
  function: 'Room Service Cleaner',
  role: 'admin',
  preferred_username: 'akushkunov@horse21.net',
  name: 'akushkunov@horse21.net',
  email_verified: true,
  phone_number_verified: false,
};

@Injectable()
export class ProtoOAuthService extends OAuthService {

  public loadDiscoveryDocumentAndLogin(options?: LoginOptions): Promise<boolean> {
    return new Promise((resolve, reject) => reject(true));
  }

  public loadDiscoveryDocumentAndTryLogin(options?: LoginOptions): Promise<boolean> {
    return new Promise((resolve, reject) => reject(true));
  }

  public initImplicitFlow = (additionalState?: string, params?: string | object): void => { };
  public logOut = (noRedirectToLogoutUrl?: boolean): void => { };
  public getAccessToken = (): string => 'access_token';
  public hasValidAccessToken = (): boolean => true;
  public hasValidIdToken = (): boolean => true;

  public loadUserProfile(): Promise<object> {
    return new Promise((resolve, reject) => {
      resolve(user);
    });
  }

  public getIdentityClaims(): object {
    return user;
  }

  public tryLogin(options?: LoginOptions): Promise<boolean> {
    return new Promise((resolve, reject) => resolve(true));
  }

  protected checkAtHash(params: ValidationParams): Promise<boolean> {
    return new Promise((resolve, reject) => reject(true));
  }

  protected validateNonceForAccessToken = (accessToken: string, nonceInState: string): boolean => true;
  protected validateDiscoveryDocument = (doc: OidcDiscoveryDoc): boolean => true;
  protected validateUrlAgainstIssuer = (url: string): boolean => true;
  protected validateUrlForHttps = (url: string): boolean => true;
  protected canPerformSessionCheck = (): boolean => true;

}

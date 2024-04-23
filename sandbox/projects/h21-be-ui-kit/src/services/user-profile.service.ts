import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// external libs
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';

// interfaces
import { IIdentityClaims } from '../interfaces/identity-claims.interface';

// models
import { UserProfile } from '../models/user-profile.model';

// services
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {

  public profile$ = new BehaviorSubject<UserProfile>(null);
  private baseEntity = 'UserProfile';

  constructor(private _http: HttpClient,
              private _auth: OAuthService,
              private _settings: SettingsService,
  ) { }

  public getUserById(userProfileId?: number): Observable<UserProfile> {
    if (userProfileId) {
      return this._http.get<UserProfile>(`${this._settings.environment.profileApi}${this.baseEntity}/GetEntity?id=${userProfileId}`);
    } else {
      return EMPTY;
    }
  }

  public getUser(): void {
    const userProfileId = this.getUserProfileId();
    if (!!userProfileId) {
      this._http.get<UserProfile>(`${this._settings.environment.profileApi}${this.baseEntity}/GetEntity?id=${userProfileId}`)
        .subscribe({
          next: (user) => {
            this.profile$.next(user);
          },
        });
    }
  }

  public getUserProfileId(): number {
    const claims = <IIdentityClaims>this._auth.getIdentityClaims();
    return claims.user_profile_id;
  }

  public acceptAgreement(): Observable<void> {
    return this._http.post<void>(`${this._settings.environment.profileApi}${this.baseEntity}/AcceptAgreement`, null);
  }

}

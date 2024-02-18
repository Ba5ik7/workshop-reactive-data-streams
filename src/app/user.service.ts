import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of, tap } from 'rxjs';
import { IUser, IUsersMetadata, user, usersMetadata } from './data.mock';

type TUserMetadata = { name: string; email: string; };

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _user = new BehaviorSubject<IUser | undefined>(undefined);
  user$ = this._user.asObservable();

  private _userMetadata = new BehaviorSubject<TUserMetadata | undefined>(undefined);
  userMetadata$ = this._user.asObservable();

  fetchUser$(): Observable<IUser> {
    return of(user).pipe(
      delay(1500),
      tap(user => this._user.next(user)),
    );
  }

  fetchUserMetadata$(userPoid: string): Observable<TUserMetadata> {
    return of(usersMetadata[userPoid]).pipe(
      delay(1500),
      tap(user => this._userMetadata.next(user)),
    );
  }
}

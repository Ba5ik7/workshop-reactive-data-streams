import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, filter, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { IUser, user, userRoles, usersMetadata } from './data.mock';

type TUserMetadata = { name: string; email: string };
type TUserRoles = { roles: string[] };
type TUserMetadataAndRoles = TUserMetadata & TUserRoles;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _user = new BehaviorSubject<IUser | undefined>(undefined);
  user$ = this._user.asObservable();

  private _userMetadata = new BehaviorSubject<
    TUserMetadataAndRoles | undefined
  >(undefined);

  userMetadata$ = this.user$.pipe(
    filter((user): user is NonNullable<typeof user> => !!user),
    switchMap((user) => {
      return forkJoin({
        userMetadata: of(usersMetadata[user.poid]),
        userRoles: this.fetchUserRoles$(user),
      });
    }),
    map(({ userMetadata, userRoles }) => ({ ...userMetadata, ...userRoles })),
    tap((userMetadataAndRoles) => this._userMetadata.next(userMetadataAndRoles))
  );

  fetchUser$(): Observable<IUser> {
    return of(user).pipe(
      delay(1500),
      tap((user) => this._user.next(user))
    );
  }

  fetchUserRoles$(user: IUser): Observable<{ roles: string[] }> {
    return of(userRoles[user.poid]).pipe(
      delay(1500),
      map((userRoles) => ({ roles: userRoles.roles }))
    );
  }
}

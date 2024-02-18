import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, combineLatest, delay, filter, forkJoin, map, of, startWith, switchMap, tap, throwError } from 'rxjs';
import { IUser, IUserRoles, IUsersMetadata, user, userRoles, usersMetadata } from './data.mock';

type TUserMetadata = Pick<IUsersMetadata[string], 'name' | 'email'>;
type TUserRoles = Pick<IUserRoles[string], 'roles'>;
type TUserMetadataAndRoles = TUserMetadata & TUserRoles;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _user = new BehaviorSubject<IUser | undefined>(undefined);
  user$ = this._user.asObservable();

  private _userMetadata = new BehaviorSubject<
    Partial<TUserMetadataAndRoles> | undefined
  >(undefined);

  userMetadata$ = this.user$.pipe(
    // tap(() => {
    //   throw new Error('Error fetching user metadata');
    // }),
    filter((user): user is NonNullable<typeof user> => !!user),
    switchMap((user) => {
      return combineLatest({
        userMetadata: of(usersMetadata[user.poid]),
        userRoles: this.fetchUserRoles$(user).pipe(startWith(undefined)),
      });
    }),
    map(({ userMetadata, userRoles }) => ({ ...userMetadata, ...userRoles })),
    tap((userMetadataAndRoles) => this._userMetadata.next(userMetadataAndRoles)),
    catchError((error) => {
      console.warn('Error fetching user metadata', error);
      return throwError(() => new Error('Pass the error along'));
    })
  );

  fetchUser$(): Observable<IUser> {
    return of(user).pipe(
      // tap(() => {
      //   throw new Error('Error fetching user');
      // }),
      delay(1500),
      tap((user) => this._user.next(user)),
      catchError((error) => {
        console.warn('Error fetching user', error);
        throw error;
      })
    );
  }

  fetchUserRoles$(user: IUser): Observable<TUserRoles> {
    return of(userRoles[user.poid]).pipe(
      // tap(() => {
      //   throw new Error('Error fetching user roles');
      // }),
      delay(3000),
      map((userRoles) => ({ roles: userRoles.roles })),
      catchError((error) => {
        console.warn('Error fetching user', error);
        return of({ roles: ['Error Getting Roles'] });
      })
    );
  }
}

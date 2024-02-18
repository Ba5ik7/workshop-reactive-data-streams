import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { IContent, content } from './data.mock';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private _content = new BehaviorSubject<IContent | undefined>(undefined);
  content$ = this._content.asObservable();

  fetchContent$(): Observable<IContent> {
    return of(content).pipe(
      tap((content) => this._content.next(content)),
    );
  }
}

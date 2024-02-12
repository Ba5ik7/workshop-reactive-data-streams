import { Injectable } from "@angular/core";
import { BehaviorSubject, from, map, of, tap, toArray } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  title = 'Idiomatic Reactive Data Streams';

  title$ = of(this.title).pipe(
    map((title) => title.toUpperCase())
  );
  titles$ = from(this.title).pipe(
    tap(console.log),
    toArray(),
    map((titles) => titles.join(''))
  );

  body = new BehaviorSubject<string>('BehaviorSubject: This is a type of subject, a special type of observable, that allows multicasting to multiple observers.');
  body$ = this.body.asObservable();
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { from, map, of, tap, toArray } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
  <h1>{{ title$ | async}}</h1>
  <h1>{{ titles$ | async}}</h1>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  title = 'Idiomatic Reactive Data Streams';
  title$ = of(this.title).pipe(
    map((title) => title.toUpperCase())
  );
  titles$ = from(this.title).pipe(
    tap(console.log),
    toArray(),
    map((titles) => titles.join(''))
  );
}

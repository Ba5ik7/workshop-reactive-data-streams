import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { combineLatest, from, map, of, tap, toArray } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
  @if (viewModel$ | async; as vm) {
    <h1>{{ vm.title }}</h1>
    <h1>{{ vm.titles }}</h1>
  }
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

  viewModel$ = combineLatest([this.title$, this.titles$]).pipe(
    map(([title, titles]) => ({ title, titles }))
  );
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { from, of } from 'rxjs';

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
  title$ = of(this.title);
  titles$ = from(this.title);
}

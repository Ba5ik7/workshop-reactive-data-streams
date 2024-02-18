import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ContentService } from './content.service';
import { filter, map } from 'rxjs';
import { IContent } from './data.mock';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    @if (viewModel$ | async; as vm) { 
      <h3>{{ vm.content.title }}</h3>
      <p>{{ vm.content.body }}</p>
      <hr />
      <h1>{{ vm.content.welcomeMessage }}</h1>
    }
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  viewModel$ = inject(ContentService).content$.pipe(
    filter((content): content is IContent  => content !== undefined),
    map((content) => ({ content }))
  );
}


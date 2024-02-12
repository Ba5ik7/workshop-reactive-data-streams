import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { combineLatest, from, map, of, tap, toArray } from 'rxjs';
import { ContentService } from './content.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
  @if (viewModel$ | async; as vm) {
    <h1>{{ vm.title }}</h1>
    <h2>{{ vm.titles }}</h2>
    <p>{{ vm.body }}</p>
  }
  <button (click)="updateValue()">Update Title and Body values</button>
  <router-outlet></router-outlet>
  `,
})
export class AppComponent {

  contentService = inject(ContentService);

  viewModel$ = combineLatest([
    this.contentService.title$,
    this.contentService.titles$,
    this.contentService.body$
  ]).pipe(
    map(([title, titles, body]) => ({ title, titles, body}))
  );

  updateValue() {
    this.contentService.title = 'It did NOT update :(';
    this.contentService.body.next('It updated!!!!');
  }
}

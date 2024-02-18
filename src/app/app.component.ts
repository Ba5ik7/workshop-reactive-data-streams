import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ContentService } from './content.service';
import { catchError, combineLatest, map, startWith } from 'rxjs';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    @if (viewModel$ | async; as vm) { 
      <h3>{{ vm.title | uppercase }}</h3>
      <p>{{ vm.body | slice: 0 : 12  }}...</p>
      <hr />
      <h1>{{ vm.welcomeMessage }} {{ vm.name ?? 'I Should be a Pipe' }}</h1>
      <p>{{ vm.emailLabel }}: {{ vm.email ?? 'I Should be a Pipe' }}</p>

      <p>{{ vm.rolesLabel }}:
      @if (vm.roles) {
        @for (role of vm.roles; track $index) {
          {{ role }}
        }
      } @else {
        Loading roles...
      }
      </p>
    }
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  contentService = inject(ContentService);
  userService = inject(UserService);

  viewModel$ = combineLatest([
    this.contentService.content$,
    this.userService.fetchUser$().pipe(startWith(undefined)),
    this.userService.userMetadata$.pipe(startWith(undefined)),
  ]).pipe(
    map(([content, user, userMetadata]) => ({
      ...user, 
      ...content, 
      ...userMetadata,
      ...content?.userInfo,
    })),
    catchError((error) => {
      console.warn('Paased down to viewModel ::', error);
      throw error;
    })
  );
}

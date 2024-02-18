import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ContentService } from './content.service';
import { combineLatest, map, startWith } from 'rxjs';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    @if (viewModel$ | async; as vm) { 
      <h3>{{ vm.title }}</h3>
      <p>{{ vm.truncate(vm.body ?? '', 12) }}</p>
      <hr />
      <h1>{{ vm.welcomeMessage }} {{ vm.name }}</h1>
      <p>{{ vm.emailLabel }}: {{ vm.email }}</p>

      <p>{{ vm.rolesLabel }}: 
      @for (role of vm.roles; track $index) {
        {{ role }}
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
    map(([user, content, userMetadata]) => ({
      ...user, ...content, ...userMetadata
    })),
    map(vm => ({
      ...vm,
      ...vm.userInfo,
      title: vm.title?.toUpperCase(),
      truncate: (str: string, length: number) => str.slice(0, length) + '...',
    }))
  );
}

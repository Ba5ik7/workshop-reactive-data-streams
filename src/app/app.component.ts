import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ContentService } from './content.service';
import { combineLatest, map, switchMap } from 'rxjs';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    @if (viewModel$ | async; as vm) { 
      <h3>{{ vm.title }}</h3>
      <p>{{ vm.body }}</p>
      <hr />
      <h1>{{ vm.welcomeMessage }} {{ vm.name }}</h1>
      <p>{{ vm.userInfo?.emailLabel }}: {{ vm.email }}</p>
    }
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  contentService = inject(ContentService);
  userService = inject(UserService);

  viewModel$ = combineLatest([
    this.contentService.content$,
    this.userService.fetchUser$(),
  ]).pipe(
    switchMap(([content, user]) => {
      return this.userService.fetchUserMetadata$(user.poid).pipe(
        map(userMetadata => ({ ...content, ...user, ...userMetadata })),
      );
    })
  );
}

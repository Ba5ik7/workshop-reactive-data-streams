#  **Step 1:**

**Explain:** We will quickly go over what most Angular codebase logic look
like when handling subscriptions.

**Code:** Copy of boilerplate code
``` javascript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: ` <h1>{{ title }}</h1> `,
})
export class AppComponent implements OnInit {
  title!: string;
  titleOf$ = of('Idiomatic Reactive Data Streams');

  ngOnInit() {
    this.titleOf$.subscribe((title) => {
      this.title = title;
    });
  }
}

```

**Explain:** `of` and `from` are RxJS functions that will create a
"cold" Observable of the data that was supplied as an argument.

**Explain:**

1.  Imperative Programming involves explicitly describing the steps
    taken to achieve a certain result.

2.  Here, you're explicitly subscribing to the Observable and setting
    the value of title within the subscribe block.

3.  The developer is manually managing the subscription and
    assignment, dictating exactly what should happen step by step.

**Note:** *Dollar sign* *is Hungarian notation. We didn't have all the
fancy LSPs we have now, on Sublime back in the day. So, this allowed us
to tell the next dev that this was something you could subscribe to. One
can argue that we don't need it anymore... old habits die hard.*

**Code:** Copy of boilerplate code
``` javascript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: ` <h1>{{ title }}</h1> `,
})
export class AppComponent implements OnInit, OnDestroy {
  title!: string;

  titleOf$ = of('Idiomatic Reactive Data Streams');

  destory$ = new Subject();

  ngOnInit() {
    this.titleOf$.pipe(takeUntil(this.destory$)).subscribe((title) => {
      this.title = title;
    });
  }

  ngOnDestroy() {
    this.destory$.next(true);
  }
}
```

**Explain:** Futhermore you have to manually unsubscribe from the
Observable to prevent memory leaks. This is done by creating a
`Subject` and using the `takeUntil` operator to complete the
subscription when the `Subject` emits a value.


## **Step 2:**
**Explain:** The async pipe is a powerful Angular feature that allows
you to subscribe to observables directly from your templates.
A huge piece of what makes this pattern idiomatic.

**Explain:** It handles subscription management automatically,
subscribing to the observable when the component loads and unsubscribing
when the component is destroyed, thus preventing potential memory leaks.

**Code:** Copy of boilerplate code
``` javascript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: ` <h1>{{ titleOf$ | async }}</h1> `,
})
export class AppComponent {
  titleOf$ = of('Idiomatic Reactive Data Streams');
}
```

**Explain:** 
1. Declarative Programming involves describing what should happen rather than how it should happen.
2. Here, the async pipe handles the subscription for you, so you're not manually subscribing or assigning values.
3. You're simply expressing that the template should display whatever the Observable emits without worrying about the underlying steps.

**Note:** The `async` pipe is a built-in Angular pipe that subscribes to an Observable or *Promise* and returns the latest value it has emitted.

## **Step 3:**

**Explain:** RxJS operators are functions that allow you to manipulate the items emitted by observables in various ways, such as transforming values, filtering streams, or combining multiple observables.

**Code:** Copy of boilerplate code
``` javascript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: ` <h1>{{ titleOf$ | async }}</h1> `,
})
export class AppComponent {
  titleOf$ = of('Idiomatic Reactive Data Streams').pipe(
    map((title) => title.toUpperCase())
  );
}
```

**Explain:** Try to think of it as a journey of the data. The reference `titleOf$` is the starting point, and the `pipe` operator is the vehicle that takes you through the journey. Each operator is a stop along the way where you can transform or manipulate the data in some way.

**Code:** Copy of boilerplate code
``` javascript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>{{ titleOf$ | async }}</h1>
    <h1>{{ titleFrom$ | async }}</h1>
  `,
})
export class AppComponent {
  titleOf$ = of('Idiomatic Reactive Data Streams').pipe(
    map((title) => title.toUpperCase())
  );

  titleFrom$ = from('Idiomatic Reactive Data Streams').pipe(
    tap((title) => console.log(title))
    // toArray(),
    // map((title) => title.join(''))
  );
}
```

**Explain:** The `from` opterator is used to convert an array, promise, or iterable into an observable. The observable will emit each item in the array, promise, or iterable individually.

**Explain:** Here, we're converting a string into an observable. The `tap` operator is used for debugging purposes, allowing you to perform side effects without affecting the stream. You can also use the `toArray` operator to collect all the emitted values into an array, and the `map` operator to transform the array into a single string.

**Explain:** We can see that adding an `async` pipe to the template will automatically subscribe to the observable and display the emitted value. However, this can be problematic if you have multiple `async` pipes in the same template, as each pipe will subscribe to the observable independently, potentially causing multiple subscriptions and performance issues.

**Explain:** The `async` pipe is a powerful tool, but it's important to use it judiciously and be aware of its behavior to avoid potential pitfalls. Like if the value is `0` of `false`. In this case the value will never show.


**Note:** It's a good practice to limit the number of `async` pipes in your templates and consider using the `combineLatest` operator to combine multiple observables into a single observable that emits an array of the latest values from each source.

## **Step 4:**

**Explain:** The `combineLatest` operator is used to combine multiple observables into a single observable that emits an array of the latest values from each source.

**Explain:** The `forkJoin` operator is used to combine multiple observables into a single observable that emits an array of the values emitted by each source observable when all source observables have completed.

**Code:** Copy of boilerplate code
``` javascript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>{{ titleOf$ | async }}</h1>
    <h1>{{ titleFrom$ | async }}</h1>
    <h1>{{ reference$ | async }}</h1>
  `,
})
export class AppComponent {
  titleOf$ = of('Idiomatic Reactive Data Streams').pipe(
    map((title) => title.toUpperCase())
  );

  titleFrom$ = from('Idiomatic Reactive Data Streams').pipe(
    tap((title) => console.log(title)),
    toArray(),
    map((title) => title.join(''))
  );

  reference$ = combineLatest([this.titleOf$, this.titleFrom$]);
}
```

**Explain:** The `combineLatest` operator can take an array or key value pair dictionary of observables as arguments. 

**Code:** Copy of boilerplate code
``` javascript
  viewModel$ = combineLatest({
    titleOf: this.titleOf$,
    titleFrom: this.titleFrom$
  });
```

**Explain:** Angular has another useful pipe called `json` that can be used to display the JSON representation of an object. This can be helpful for debugging purposes or when you want to display the raw data in your template.

**Code:** Copy of boilerplate code
``` html
  <pre><code>{{ viewModel$ | async | json }}</code></pre>
```

**Note:** The `pre` tag is used to define preformatted text, preserving both spaces and line breaks. The `code` tag is used to define a piece of computer code. By combining these two tags, you can display the JSON representation of the object in a formatted and readable way.

**Code:** Copy of boilerplate code
``` javascript
  @if (viewModel$ | async; as vm) {
    <h1>{{ vm.titleOf }}</h1>
    <h1>{{ vm.titleFrom }}</h1>
  }
```

**Explain:** Use the Angular's structural directive `*ngIf` or new `@if` with the async pipe to unwrap the combined observable and access the title and titles properties.

**Explain:** The `as` keyword allows you to assign the unwrapped value to a local variable, `vm`, which you can then use to access the properties of the object.

**Explain:** This approach is more efficient than using multiple `async` pipes in the template, as it only subscribes to the observable once and allows you to access the properties of the object directly.

**Code:** Copy of boilerplate code
``` javascript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (viewModel$ | async; as vm) {
      <h1>{{ vm.titleOf }}</h1>
      <h1>{{ vm.titleFrom }}</h1>
    } @else {
      <h1>Loading...</h1>
    }
  `,
})
export class AppComponent {
  titleOf$ = of('Idiomatic Reactive Data Streams').pipe(
    map((title) => title.toUpperCase())
  );

  titleFrom$ = from('Idiomatic Reactive Data Streams').pipe(
    tap((title) => console.log(title)),
    toArray(),
    map((title) => title.join(''))
  );

  viewModel$ = combineLatest({
    titleOf: this.titleOf$,
    titleFrom: this.titleFrom$,
  }).pipe(delay(3000));
}
```

**Explain:** Adding the else block to the `@if` directive allows you to handle the case where the observable has not emitted a value yet. You can display a loading spinner or error message in this block to provide a better user experience.



## **Step 5:**

**Create File** `ng generate service data`

**Code:** Copy of boilerplate code
``` javascript
import { Injectable } from "@angular/core";
import { from, map, of, tap, toArray } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  title = 'Idiomatic Reactive Data Streams';

  titleOf$ = of(this.title).pipe(
    map((title) => title.toUpperCase())
  );

  titleFrom$ = from(this.title).pipe(
    tap(console.log),
    toArray(),
    map((titles) => titles.join(''))
  );
}
```

**Explain:** Angular services are, most of the time, singleton objects. They are only instantiated once and can be injected into any component or service that requests them through dependency injection. So, basicly they are never '*newed*' up.

**Code:** Copy of boilerplate code
``` javascript
export class AppComponent {
  dataService = inject(DataService);

  viewModel$ = combineLatest({
    titleOf: this.dataService.titleOf$,
    titleFrom: this.dataService.titleFrom$,
  }).pipe(delay(3000));
}
```

**Explain:** The new `inject` function is used to inject a service into a component or service. This function is a shorthand for the `constructor` method and automatically injects the service into the component or service.

**Create File** `ng generate service user`

**Code:** Copy of boilerplate code
``` javascript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly users = new BehaviorSubject<{ [key: string]: string }>({
    name: 'John Doe',
  });
  public users$ = this.users.asObservable();

  // private users = 'Some initial content here';
  // getUsers() {
  //   return this.users;
  // }
}
```

**Code:** Copy of boilerplate code `app.component.ts`
``` javascript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (viewModel$ | async; as vm) {
    <h1>{{ vm.titleOf }}</h1>
    <h1>{{ vm.titleFrom }}</h1>
    <pre><code>{{ vm.users | json }}</code></pre>
    } @else {
    <h1>Loading...</h1>
    }
  `,
})
export class AppComponent {
  dataService = inject(DataService);

  viewModel$ = combineLatest({
    titleOf: this.dataService.titleOf$,
    titleFrom: this.dataService.titleFrom$,
    users: inject(UserService).users$,
  })
}
```


**Explain:** The `BehaviorSubject` is a type of subject, a special type of observable that allows multicasting to multiple observers. It stores the latest value emitted by the observable and replays it to new subscribers.

**Explain:** Using encapulation just like the getter and setter methods. The `asObservable` method is used to convert the `BehaviorSubject` into a regular observable, allowing you to expose the observable publicly without exposing the `next` method.

* **BehaviorSubject:** It stores the current value. When a user subscribes, it will immediately receive the "current value" from the BehaviorSubject.
* **Subject:** It does not store the current value. When a user subscribes, it will not receive the "current value" from the Subject.
* **ReplaySubject:** It stores a number of values and will replay those values to new subscribers. It stores the values in a buffer that will be sent to new subscribers.

## **Step 6:**
#### Do you have enough time to complete the reactive data streams?

**Explain:** This is rushing into the 2nd workshop on this topic. However, I believe it's important for this group to see the pattern from end to end.

**Explain:** In most cases the model's data isn't static. Most of the time there is an AJAX request to fetch the data from the server. This is where the `HttpClient` service comes in.

**Code:** Copy of boilerplate code `user.service.ts`
``` javascript
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  private readonly users = new BehaviorSubject<{ [key: string]: string }>({
    name: 'John Doe',
  });
  public users$ = this.users.asObservable();

  public fetchBody$() {
    return this.http
      .get<{ [key: string]: string }>('https://jsonplaceholder.typicode.com/users')
      .pipe(tap((data) => this.users.next(data)));
  }
}
```

**Code:** Copy of boilerplate code `app.config.ts`
``` javascript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
  ],
};
```

#### How to invoke the `fetchBody` method? 

#### Strategy 1

**Explain:** Using the `APP_INITIALIZER` token to run the `fetchBody` method during the application bootstrap process. `useFactory` is a function that returns a function that returns a observable.

**Code:** Copy of boilerplate code `app.config.ts`
``` javascript
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './user.service';

function initializeAppFactory(userService: UserService) {
  return () => userService.fetchBody$();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      multi: true,
      deps: [UserService],
    },
  ],
};
```

**Explain:** Problem with this approach is that the `fetchBody` needs to complete before the application can bootstrap.

**Code:** Copy of boilerplate code `app.config.ts`
``` javascript
import { firstValueFrom } from 'rxjs';

function initializeAppFactory(userService: UserService) {
  return () => {
    firstValueFrom(userService.fetchBody$())
    return Promise.resolve();
  }
}
```

**Explain:** The `firstValueFrom` function is used to convert an observable into a promise that resolves with the first value emitted by the observable. Allowing the application to bootstrap before the `fetchBody` obvserable completes.

**Code:** Copy of boilerplate code `content.service.ts`
``` javascript
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, delay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  private readonly users = new BehaviorSubject<
    { [key: string]: string } | undefined
  >(undefined);
  public users$ = this.users.asObservable();

  fetchBody$() {
    return this.http
      .get<{ [key: string]: string }>(
        'https://jsonplaceholder.typicode.com/users'
      )
      .pipe(
        delay(3000),
        tap((data) => this.users.next(data))
      );
  }
}
```

**Explain:** The `delay` operator is used to introduce a delay of 3 seconds before the observable emits the data. This simulates a network request that takes some time to complete.
#  **Step 1:**

**Explain:** We will quickly go over what most Angular codebase logic look
like when handling subscriptions.

**Code:** Copy of boilerplate code
```
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <h1>{{ title }}</h1>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {

  title!: string
  titleOf$ = of('Idiomatic Reactive Data Streams');

  ngOnInit() {
    this.titleOf$.subscribe((title) => {
      this.title = title;  
    })
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
```
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <h1>{{ title }}</h1>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit, OnDestroy {
  
  title!: string

  titleOf$ = of('Idiomatic Reactive Data Streams');

  destory$ = new Subject();

  ngOnInit() {
    this.titleOf$
    .pipe(
      takeUntil(this.destory$)
    )
    .subscribe((title) => {
      this.title = title;  
    })
  }

  ngOnDestory() {
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

**Explain:** It handles subscription management automatically,
subscribing to the observable when the component loads and unsubscribing
when the component is destroyed, thus preventing potential memory leaks.

**Code:** Copy of boilerplate code
```
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <h1>{{ titleOf$ | async }}</h1>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  titleOf$ = of('Idiomatic Reactive Data Streams');
}
```

**Explain:** 
1. Declarative Programming involves describing what should happen rather than how it should happen.
2. Here, the async pipe handles the subscription for you, so you're not manually subscribing or assigning values.
3. You're simply expressing that the template should display whatever the Observable emits without worrying about the underlying steps.
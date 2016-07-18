# Store or State

**Redux** maintains state in the store. The main reason is that it exposes the `dispatch` function that you call with your action. There are more functions like registering middleware. What's amazing is that you can even create Observable on the Store.

Most often you use `getState()` and `dispatch()` within `connect`-ed components.


**What about RxR?**

Let's see what we have:

* streams (like `userSelected`). They are streams. You can use them alone - without knowing anything about state, dispatch, reducer...
* reducer-like stream. This stream gives us stream of functions that accept state and create new state.

So far we do not need anything else, but...

## ...where is the state?

Actually - state we want (and get) is not a static state but a stream of states. Uh? Don't be puzzled. It's an observable that gives you current state (and any new state created by any reducer). Comfort!

Ok, so how do we get the state stream?

It's simple with RxJS operators.

```javascript
const state$ = initialState$
  .merge(combinedReducer$)
  .scan((state, reducer) => reducer(state))
  .publishReplay(1)
  .refCount();

// with RxR you create it with helper method:
const state$ = createState(combinedReducer$, initialState$);
```

Yes, that's it. Let's decompose it.

`initialState$` gives you exactly what it states - initial state. For example: `{ itemsSelected: [] }`. It is an Observable (stream) that emits just single value and finish. In our case it would be `Rx.Observable.of({ itemsSelected: [] })`. When you use `createState()` function, you can pass a regular object as initial state.

`merge(combinedReducer$)` again does exactly what it states. You remember that reducer emits functions that takes state and creates another state. combinedReducers$ are merged reducers into one stream of these functions.

Here we merged two streams - stream that gives you recent state and stream that gives you function to modify that state. This new function is emitted every time you push something into any messageStream, do you remember?

`scan((state, reducer) => reducer(state))` may be little bit difficult to swallow but it's pretty simple. It works very similar to `reduce`. It's like `.scan((accumulator, item) => somefunc())`. Accumulator is ... our beloved state. And anytime new reducer function arrives from combinedReducer, it apply the function on the state and creates new. Hooooray, we have the state finally!

See the [marble of scan](http://rxmarbles.com/#scan).

`publishReplay(1)` and `refCount()` combined do 2 things. They create hot observable (generally observable that emits values that may be consumed by multiple observers/subscribers). Think of it as a arrivals/departure board on the airport. No matter how many people are there, all get the same value.*

So when you subscribe to the `state`, you get stream of states. Every time the state changes, you (your function, your logger, your component) gets this new state.

Isn't this magic? I think it is. RxJS is really great!

_* Note: The true is that in our example when there is nobody to watch the arrivals/departure board, the board will be switched off (if it would be RxJS based). This is efficient. And very similar to Promises. You can get Promise (eg. `fetch('http://www.google.com')`) but until you call `.then` on it, it will not make the request. This is similar to Observables._

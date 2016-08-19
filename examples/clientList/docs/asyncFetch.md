# Async & Fetch

One of the usual way how to handle async fetch in Redux is using Dan Abramov `thunkMiddleware`. It is handled by action creator that doesn't return object but function that is caught by this middleware before reducers and processed.

In my opinion this is the one "irregularity" I do not like on Redux too much. It feels like a patch for me. Please don't take me wrong - it is just my feel, I do not want to tell you that it is like that. Even I consider it as a patch, it is brilliant patch.

## RxR (or RxJS)

In RxR we are not dispatching messages, we are just putting them into the proper message stream and we suppose that in the end we will get the (pure) function how to modify the state. Time doesn't matter here... so any part of the stream may simply wait for promise to be resolved and then produce the function and pass it further. This is amazing on the streams (and ReactiveX).

So in this example in RxR we use `asyncFetchDataRx` helper:

```javascript
// asyncFetchDataRx (please, don't complain about the stupid name :)
import Rx from 'rxjs';
import 'rxjs/add/operator/catch';
import fetch from 'isomorphic-fetch';
import {
  CLIENTS_DATA_URL,
} from './constants';

/**
 * Async data loading
 *
 * @param  {[string]} url to load from
 * @return {[stream]} Observable stream of data
 */
const asyncFetchDataRx = (url = CLIENTS_DATA_URL) => (
  Rx.Observable.fromPromise(fetch(url))
  .flatMap(response => Rx.Observable.fromPromise(response.json()))
  .catch(err => Rx.Observable.of(new Error(err)))
);

export default asyncFetchDataRx;
```

It's very similar with approach with promises (see as you can see in [Redux example within `actions`](./actions.md)).

Let's go step by step.

It is function that gets url to be fetched and returns `Rx.Observable.fromPromise` (chained twice because we get promise to be fetched and then promise to be json parsed). It's pretty similar to `fetch(url).then(response => response.parse()).then(json => ... do something with json)` chain.

Because `fromPromise` creates another stream, it has to be `flatMap`ed to current stream. Puzzling. Little bit but you will get into it.

This helper returns again `Observable.fromPromise` and that's why we have to use in the corresponding "reducer" stream the `flatMap`, too, not usual `map`.

```javascript
// ...
actionStreams.fetchClientsS
  .flatMap((url = CLIENTS_DATA_URL) => {
    const ts = Date.now();
    // notify about the loading
    actionStreams.clientsDataLoadingS.next(ts);
    return asyncFetchDataRx(url);
// ...
```

Rx offers us more benefits, like possibility to retry fetch and more. So the `asyncFetchDataRx` may be extended like:

```javascript
const asyncFetchDataRx = (url = CLIENTS_DATA_URL) => (
  Rx.Observable.fromPromise(fetch(url))
  .retryWhen(errS => errS.delay(1000).take(10))
  .flatMap(response => Rx.Observable.fromPromise(response.json()))
  .catch(err => Rx.Observable.of(new Error(err)))
);
```

It will try 10 times with 1000 milliseconds delays. No special coding required.

RxJS has one disadvatage - it is **huge** and it discourages you to learn it. But you can start slowly and using just a couple operators. As you will get into it, your code will be cleaner.

Look at [RxMarbles](http://rxmarbles.com/). They are great. They cover just a small part of all operators - it's like 2 minutes trailer of full movie. You will recognize highly useful functions like `debounce`, `take,` `skipUntil`... just to name some of them.

---

What next? Try to rewrite one of your current Redux app in RxR and RxR-Redux ;)

Read the [gitbook about RxR](https://dacz.github.io/rxr/).

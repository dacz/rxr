# rxr

Use [RxJS](https://github.com/ReactiveX/rxjs) with React the way similar to Redux. If you know Redux, rxr introduces very similar concept using into RxJS. It allows to **rewrite Redux app** to use pure RxJS with rxr fast with **most of the main code intact**. This is huge benefit when you want just play with something you already have. To learn, to play... ;)

I'm sure there are different ways how to use RxJS with React. Redux is very popular (and I like it a lot!) and it established some code structure and thinking about the app. Applying RxJS the Redux way has a lot of benefits. We may build on what we know and therefore it's easier to learn RxJS.

In this text I'm putting RxJS and Redux side by side not to compare them but show the RxJS concept and make it easier to understand.

This text and approach is heavily based (and some parts copied) on [amazing article of Michal Zalecki](http://michalzalecki.com/use-rxjs-with-react/). I cannot give enough kudos and appreciations to [Dan Abramov](https://github.com/gaearon) and not just for [Redux](https://github.com/reactjs/redux) and it's amazing tutorials but for all good he does for React and javascript community at all. And of course my deep respect to everyone who bring us [RxJS](https://github.com/ReactiveX/rxjs).

[We are standing on the shoulders of giants](https://en.wikipedia.org/wiki/Standing_on_the_shoulders_of_giants).


### Why?

RxJS (reactive programming) is great concept. I'm not educated enough to sell you all the benefits (and benefits of functional programming) but you find a lot of resources online.


### Status

In this you can see Redux and RxJS side by side. I've put together simple [rxr](https://github.com/dacz/rxr) and [rxr-react](https://github.com/dacz/rxr-react) packages to start easy. I plan very soon to add the complete example written in Redux and rxr. It is work in progress...


## Encouragement

You can recognize Actions, Reducer and Store from Redux, so you will feel familiar. But in a slightly different way.



## Parts

### Actions/Messages and Pipes

Redux is about passing actions (IMHO - they should be named messages. They are not active, they are just data). Each action carries payload, like "user clicked here", "this data arrived" etc. And each of this action/message visits every app reducer to check if it can use it. Constants are usually involved to give names (types) to actions. They are reduces's address, too. Actions and reducers are looking for each other to find the same type they are... love!

For our RxJS implementation let's think about slightly different concept - pipes. In `Rx` they are called streams. We can give them the same name.

As unix pipe, you can push a message to the stream and it moves it further - to anything that's connected to this stream (we will call it xtream from now, not pipe, because Rx is about streams, ok?).

Our Redux-like actions are streams that are constructed super easy as `new Rx.Subject`. Subjects are observables and observers in one. That's why we can push a message to them and they will give it to any other stream (observer or listener) who asked for it.

You can push single value or complex object to them. Yes, you can use the message you have in Redux but you don't need to use `type` property. Why? Because you push your message into just one stream - the right one. Stream of user's click on ButtonX or user scrolls or data arrived from fetch...

You may assume that it is limitation but it isn't. Even in redux it's very rare that more than one reducer responds to one message (action.type). Why? Because one message would be able to trigger more than one simultaneous state changes. In Redux you usually are not in control about the sequence of processing the actions by the reducers.

In rxr you can compose streams - connect one stream to another. Just like map, filter, reduce we like so much.

So you got it?

Actions are messages. In rxr we have streams (aka pipes).

[IMAGE HERE] TODO

Redux: Action(message) represents data (let thunks leave aside for now)

rxr: You push message to stream.

[IMAGE END] TODO

Think about the _streams_ like arrays and about the functions that modifies the items as `map` function on Arrays. In fact it is very very similar. The difference is that we are not working with finite arrays but very often with events that happens during lifetime of an app - like user clicks, page transitions etc.



### Hello Reducer

Redux reducer transforms actions data (messages) and current state to new state:

action/message + current state => new state

Some reasonable principles are set here (pure functions, immutable state).

rxr reducer (if we can call it reducer) is slightly different. Do you remember - we've put the message (like 'user clicked X') into the stream (one of many). If we want we may compose here more functionality (like throttle or compute the number of click within seconds if we want to know them) and add them to our message.

That's nice but we talked about the reducer. The rxr reducer does usual data transformation (as map etc.) but we put here specific requirement. That the output will be function and not data.

Whaaaat?

The function is intended to accept current state as argument and to return new state. Sounds familiar? Yes. Very similar (or identic) function(s) like we have in Redux reducer. Puzzled?

Gimme example, please!

User selected item "A". We invoked function `userSelected('A')` in the code.

The message looks like: `{ selectedItem: 'A' }` and is pushed to our stream with name like `userSelected$`.

This message arrives to the reducer and we just want the reducer to produce the function that takes the current state and generates new state.

In our example the state was for example: `{ itemsSelected: [] }`. We want our reducer to produce the function like `(state) => ({ itemsSelected: state.itemsSelected.push('A') })`. How it does it? Simple:

`userSelected$.map(item => (state) => ({ itemsSelected: state.itemsSelected.push('A') }))`

In Redux it will be very similar: the action will be like `{ action.type: 'selectedItem', value: 'A' }` and the reducer part would be like `if (action.type === 'selectedItem') { return { ...state, itemsSelected: state.itemsSelected.push(action.value) }`. For now let's not think about dispatching and store.

You see that the logic is nearly the same. The interesting difference is that in rxr we emit function that tells us exactly what to do. `push('A')` and not `push(message.value)`. This is because we will use this function exactly once. It's stream of function, do you remember? Next time it will be function that pushes different value. It has interesting benefits in debugging the app - we can monitor not only messages but even the function streams to see what's happening with our state.

And it is easy to test, too - just test if the returned function does what is should to.

Isn't this nice?

```javascript
const userSelected$ = new Rx.Subject;
// ^^^ can be easily create with createMessageStreams helper

// reducer-like part
userSelected$.map(item => (state) => ({ itemsSelected: state.itemsSelected.push(item) }));

// ... later somewhere in the code
userSelected$.next('A');

// ... or use function created with createMessageStreams
// or with createPushMessageFunctions and just write:
userSelected('A');
```

No dispatch, no constants (don't get me wrong, I really like Redux!)

Yes, we do not have the whole picture here (as we don't with Redux code) but this is pretty much of it.

Note:

You can even write join first two lines and create message stream (aka action) and reducer in one line:

```javascript
const userClicked$ = new Rx.Subject.map(item => (state) => ({ itemsSelected: state.itemsSelected.push('A') }));
```

It depends on where you want to have the code and how big your project is.


Redux combines reducer functions within reducer usually with `switch` statement if you have more than one within reducer (but you can use anything else). And you can `combineReducers`.

In RxJS you have multiple pipes and if you want to merge them together, you... merge them together:

```javascript
const mergedReducer = Rx.Observable.merge(
  userSelected,
  pageTransition,
  otherStream,
  someEvenOtherStream
)
```

One small difference is noticeable: Redux reducer needs current state and action (message ;)) and creates new state.

rxr reducer doesn't need (yet) the current state, because it is producing the functions that will be applied to the state. Nice.

Lets learn RxJS a little bit: Merge does... merge streams. RxJS has great tool to demonstrate it's functions - RxMarbles. See the [merge one](http://rxmarbles.com/#merge).

_Note: There is one more - bigger - difference with Redux reducer and combineReducers. In Redux each Reducer maintains it's own branch of the whole state. When you have reducers `redA` and `redB` and you will combine them, the state will have shape `{ redA: stateA, redB: stateB}`. This is good for encapsulation and composition (each reducer has to know only it's own part of the state and not the whole structure). On the other side it slightly complicates using library like Immutable (the state becomes regular object of Immutable objects or even more difficult if we have deeper nesting reducers).

In rxr for now all reducers are supposed to get the full state. I plan to add `combineReducersWithStructure` and extend `createMessageStreams`, so you may be able to create non flat messageStreams structure and each messageStream will be able to work with distinct part of the state. But I like Immutable and would like to find solution that works with it by default._



### Create Store or Create State

Redux maintains state in the store. The store has another functions - especially dispatch. You are not calling reducer directly but you dispatch the actions (messages) to the store. And there are other things you can do in store (have middleware like thunk or logger).

What about rxr?

Let's see what we have:

* streams (like `userSelected`). They are streams. You can use them alone - without knowing anything about state, dispatch, reducer...
* reducer-like stream. This stream gives us stream of functions that accept state and create new state.

Where is the state?

Actually - state we want is not a static state but a stream of states. Uh? Don't be puzzled. It's an observable that gives you current state (and any new state created by any reducer). Comfort!

Ok, so how do we get the state stream?

It's simple with RxJS operators.

```javascript
const state = initialState
  .merge(combinedReducer)
  .scan((state, reducer) => reducer(state))
  .publishReplay(1)
  .refCount();
```

Yes, that's it. Let's decompose it.

`initialState` gives you exactly what it states - initial state. For example: `{ itemsSelected: [] }`. It is an Observable (stream) that emits just single value and finish. In our case it would be `Rx.Observable.of({ itemsSelected: [] })`.

`merge(combinedReducer)` again does exactly what it states. You remember that reducer emits functions that takes state and creates another state. combinedReducers are just merged multiple reducers and we can consider them to be one stream of these functions.

Here we merged two streams - stream that gives you recent state and stream that gives you function to modify that state. This new function is emitted every time you push something into pipe, do you remember?

`scan((state, reducer) => reducer(state))` may be little bit difficult to swallow but it's pretty simple. It combines latest values of the streams. What function it uses to combine them? Yeeees - function you got from combinedReducer!

And this function (finally) creates new state. See the [marble of scan](http://rxmarbles.com/#scan).

`publishReplay(1)` and `refCount()` combined do 2 things. They create hot observable (generally observable that emits values that may be consumed by multiple observers/subscribers). Think of it as a arrivals/departure board on the airport. No matter how many people are there, all get the same value.*

So when you subscribe to the `state`, you get stream of states. Every time the state changes, you (your function, your logger, your component) gets this new state.

Isn't this magic? I think it is. RxJS is really great!

_Note: The true is that in our example when there is nobody to watch the arrivals/departure board, the board will be switched off (if it would be RxJS based). This is efficient. And very similar to Promises. You can get Promise (eg. `fetch('http://www.google.com')`) but until you call `.then` on it, it will not make the request. This is similar to Observables._

So let's recap again.

[IMAGES] TODO


## React, Redux and rxr

Library React-Redux has awesome `Provider` and `connect`. `Provider` injects redux store into react context and `connect` picks it and allows you to `mapStateToProps` and `mapDispatchToProps`. It encourages you to create higher order components (HoC) 👍. It does some heavy lifting to optimize performance and avoid re-rendering when not needed.

Accompanying library [React-rxr](https://github.com/dacz/react-rxr) shamelessly borrows the `Provider`. And our `ConnectWithState` is really simple and actually I'm not sure if the reason is that it is naive implementation or because of RxJS awesomeness. I believe in the later. And it works.

This is how HoC component looks like with React-rxr:

```javascript
import { connectWithState } from 'rxr-react';
import MyContainer from './MyContainer';
// let suppose that our userSelected$ stream is already bound with .next()
// and inside the object like this:
import myMessageStreams from './myMessageStreams';

const selector = (state) => ({
  itemsSelected: state.itemsSelected,
  userSelected: myMessageStreams.userSelected,
});

const MyHoCContainer = connectWithState(selector)(MyContainer);
```

`selector` is just the function that takes `state` (not stream but the data itself - like reducers functions) and creates object you want to pass as a props to the pure component. This component usually doesn't need the whole state (and should not get it because it would not be effective. Think about `selector` as an filter. The object (or it's parts) inside returned function is identical with redux's `mapStateToProps` (here eg. `itemsSelected: state.itemsSelected`).

But wait - what is `userSelected`? Because we are not bound to store (and it's dispatch), we do not have separate mapping to dispatch. Therefore we can send to props our message streams. We send them as a function that push it's argument to the pipe and that doesn't have to know about state, store or next(). It's similar or even identical to `bindActionsCreators` - they do not know about `dispatch`, too.

Now our component gets `itemsSelected` (array) and `userSelected` (function) as props. You know what to do with them. You can have something like `onClick={ userSelected('A') }` on your button or so. Simple!


**How did we implemented `connectWithState`?**

It's simple (thanks to power of RxJS and React):

```javascript
const connectWithState = (selector = (state) => state) => (WrappedComponent) =>
    class ConnectWithState extends React.Component {

      // we need this for using context
      static contextTypes = {
        state$: PropTypes.object, // observable is an object
      };

      // we pick up the state$ from context here
      constructor(props, context) {
        super(props, context);
        this.state$ = context.state$;
      }

      // we get the state stream (1)
      // and with help of selector prepare just
      // the data (and func/streams) we need (2)
      // we do not update state if the data
      // we prepared are the same (3)
      // (::this.setState) is ES7 syntax -
      // like shortcut of (data) => setState(data))
      // and subscribe (4) to actually get all of this.
      componentWillMount() {
        this.subscription = this.state$      //1
        .map(selector)                       //2
        .distinctUntilChanged((a, b) => deepEqual(a, b)) //3
        .subscribe(::this.setState);         //4
      }

      // unmounting means we want to unsubscribe
      componentWillUnmount() {
        this.subscription.unsubscribe();
      }

      render() {
        return (
          <WrappedComponent {...this.state} {...this.props} />
        );
      }
    };
```

See the marble of [map](http://rxmarbles.com/#map) and [distinctUntilChanged](http://rxmarbles.com/#distinctUntilChanged).

Because of our `state` observable is hot, we can have multiple components subscribed to state and all of them will get the last state and update on it's update.


## App

App (index.js) is pretty straightforward (I duplicated some code from above for clarity and reducer is single ):

```javascript
import React from 'react';
import { render } from 'react-dom';
import Rx from 'rxjs';
import { createState } from 'rxr';
import { Provider } from 'rxr-react';

const userSelected$ = new Rx.Subject;

const userReducer$ = userSelected$
  .map(item => (state) => ({ itemsSelected: state.itemsSelected.push(item) }));
const initialState = { itemsSelected: [] };

const state$ = createState(userReducer$, initialState);

render(
  <Provider state$={ state$ }>
    <App />
  </Provider>, document.getElementById('index')
);
```


## Here it is

That's pretty all you get. I prepared basic packages for you to use ([rxr](https://github.com/dacz/rxr) and [rxr-react](https://github.com/dacz/rxr-react)). They are in the early stages and feedback and PRs are more than welcome.

I'll publish very soon simple example project implemented in rxr and Redux so you can follow the similarities and differences.

High on my priority is to prepare some videos.

If interested, just follow this repo or follow me on twitter.


## Async

Generally speaking, async is amazing with RxJS. I'll write more about it soon with examples of using with rxr. You can find a lot of examples of RxJS and async.



## Middleware

It's easy to subscribe to state changes and even messages that are pushed to reducer. You get stream of state changes and you can log them to console or do whatever you want. I plan to add simple logger.

I plan to add a way how to add middleware that may change createState reducer behavior (to be able to stop some messages etc). I like thing simple and straightforward and I did not hit yet the need to do it.



## DevTools

Again - thanks to RxJS it's easy to subscribe to state changes and even messages that are pushed to reducer. So (I hope) adding rxr dev tools like Redux has, should not be so difficult (but I may be wrong, of course). It's on the wish-list.



## Server Side Rendering

TODO this part. Anyone would like to help?



## Working with react-router

I think that there is probably a couple of very good packages to make history/router observable/observers. I'm looking forward to have a time to explore it and prepare some examples. PRs welcome!



## To do

* make better documentation!
* minimize build. Tree shaking with webpack2 and/or importing only used functions of RxJS. Now minimized and gzipped size is 40kB (umd).



## Why this approach

As stated on the beginning, you may very easily rewrite your existing Redux app to RxJS and rxr. You may find that you ended up with less code and (thanks to RxJS) new possibilities out of the box. It can be done very quickly.

Why would you want to do that, you may ask?

For me it's about learning and exploring. I see it more straightforward (no dispatch, message types and constants). The code is more maintainable for me. I like the RxJS approach (generally reactive or functional programming). And you get new interesting functions out of the box: debounce, throttle, retry, ... User interactions are probably easier to process with streams ([see Netflix slides](http://www.slideshare.net/RyanAnklam/rethink-async-with-rxjs) for example).

Or you can just play with it and then throw it away.

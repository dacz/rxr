# Reducers

**Redux reducer** transforms actions data (messages) and current state to new state:

`action/message + current state => new state`

Some reasonable principles are set here (pure functions, immutable state).

**RxR reducer** (if we can call it reducer) is slightly different. It transforms the message stream to stream of functions that modifies state.

`messageStream => stream of functions: (state) => new state`


## Whaaaat?

One aspect of functional programming (and RxJS is functional) is that you are much less working with data and much more working with functions. What does it mean?

### Redux reducer  
actually takes state and make new state. Therefore you see that it takes 2 arguments (action and state) and create one output (new state). It's output will be like `{ selectedItems: ['Q', 'A'] }` (because there already was 'Q').

### RxR reducer
is simpler - it makes simple transformation of the data. One argument in (messageStream) and one output (state modification functions stream). It's output will be like `(state) => ({ selectedItems: state.selectedItems.push['A'] })`.

RxR reducer **doesn't need the state yet**.

What is great is the fact that **the function you return from RxR reducer is usually identical to the function you have in Redux reducer**. The logic is exactly the same (except with combinedReducers see below).

In another words in RxR the reducer is just the transformation on the messageStream.

Usually it is even more straightforward in RxR. For example you create messageStream of items selected (or deselected) by user. You can even process somehow the data during the flow - like add timestamp or so. You can add logging to any part of the stream to debug this stream. And the last transformation is "reducer like" where you emit not data but function.


## Dispatching (or not?)

**In Redux** you do not communicate directly with reducer. There is state (later, later) and you dispatch the actions. And by design all actions arrives to all reducers (and usually their switch statements). That's why they have `type` property discussed in the Actions section. Kind of signature ... looking or reducer with the same signature (`case 'user_clicked':`) ... and then love ... - and new state is usually born.

**In RxR** we have distinct streams. You put right message to the right stream. No signatures needed.

As we saw in [Actions, Messages and Streams section](./ActionsStreams.md) there is **no dispatch**. We simply put new data into the right messageStream, like:

```javascript
userAddedS.next('A');
```

or even "functionalized" by `createPushMessageFunctions` we can call `userAdded('A')`.

There is no state (yet), just functions that tell us how to modify the state.

The advantage of no state (yet) and no dispatch (at all) in RxR is that we are still in one single stream - we do not need anything else, yet.

And it is easy to test, too - just test if the returned function does what is should to.

Isn't this nice?

```javascript
const userSelectedS = new Rx.Subject;

// reducer-like part
userSelectedS.map(item => (state) => ({ itemsSelected: state.itemsSelected.push(item) }));

// ... later somewhere in the code
userSelectedS.next('A');

// ... or use function created with createMessageStreams
// or with createPushMessageFunctions and just write:
userSelected('A');
```

No dispatch, no constants (don't get me wrong, I really like Redux!)

Yes, we do not have the whole picture here (as we don't with Redux code) but this is pretty much of it.


## Multiple reducers

**Redux** combines reducer functions (different action types) within reducer usually with `switch` statement if you have more than one within reducer.

Multiple reducers are composed with `combineReducers`.

**In RxR** you have multiple pipes and if you want to merge them together, you... merge them together with RxJS:

```javascript
const mergedReducer = Rx.Observable.merge(
  userSelected,
  pageTransition,
  otherStream,
  someEvenOtherStream
)
```

Lets learn RxJS a little bit here. RxJS has great tool to demonstrate it's functions - RxMarbles. See the [merge one](http://rxmarbles.com/#merge).

_Note: **There is one more - bigger - difference with Redux reducer and combineReducers**. In Redux each Reducer maintains it's own branch of the whole state. When you have reducers `redA` and `redB` and you will combine them, the state will have shape `{ redA: stateA, redB: stateB}`. This is good for encapsulation and composition (each reducer has to know only it's own part of the state and not the whole structure). On the other side it slightly complicates using library like Immutable (the state becomes regular object of Immutable objects)._

_In RxR for now all reducers are supposed to get the full state. I plan to add something like `combineReducersWithStructure` and extend `createMessageStreams`, so you may be able to create non flat messageStreams structure and each messageStream will be able to work with distinct part of the state. But I like Immutable and would like to find solution that works with it by default._

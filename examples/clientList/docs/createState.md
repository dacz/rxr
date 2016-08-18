# Create state

Redux creates store not state but store in the main file `index.js`. We [talked about it](./appIndex.md) when we were discussing this file. It is the object that stores and manages state with `dispatch`, have `getState()` function to obtain state and have some other functions.

RxR creates state stream as we briefly mentioned. This stream is again usual `Rx.Observable`. It doesn't need any `getState`, any `dispatch`. In the [RxR gitbook](https://dacz.github.io/rxr/docs/basics/StoreState.html) you can see how the state stream is created. It's beautiful in my opinion :)

I wanted to mention it because it's better for understanding similarities with `connect` (Redux) and `connectWithState` (RxR).

---

So let's [connect with state! ... &raquo;](./connectWith.md)

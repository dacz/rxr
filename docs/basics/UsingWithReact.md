# Using With React

Library **React-Redux** has awesome `Provider` and `connect`. `Provider` injects Redux store into react context and `connect` picks it and allows you to `mapStateToProps` and `mapDispatchToProps`. It encourages you to create higher order components (HoC) 👍. It does some heavy lifting to optimize performance and avoid re-rendering when not needed.

Accompanying library **[RxR-React](https://github.com/dacz/rxr-react)** shamelessly borrows the `Provider`. And our `ConnectWithState` is really simple and actually I'm not sure if the reason is that it is naive implementation or because of RxJS awesomeness. I believe in the later. It works.

This is how HoC component looks like with RxR-React:

```javascript
import { connectWithState } from 'rxr-react';
import MyContainer from './MyContainer';
// let suppose that our userSelected$ stream is already bound with .next()
// and inside the object myMessageStreams
import messageStreams from './messageStreams';

const selector = (state) => ({
  itemsSelected: state.itemsSelected,
  userSelected: myMessageStreams.userSelected,
});

const MyHoCContainer = connectWithState(selector)(MyContainer);
```

`selector` is transformation function (map) that takes `state` and creates object you want to pass as a props to the pure component. This component usually doesn't need the whole state (and should not get it because it would not be effective as React teaches us). Think about `selector` as an filter.

It's worth to mention that the object (or it's parts) inside returned function is identical with redux's `mapStateToProps` (here eg. `itemsSelected: state.itemsSelected`). It makes rewriting app from Redux to RxR easy, too!

But wait - what is `userSelected`? Because we are not bound to store (and it's dispatch), we do not have to have separate mapping to dispatch. Therefore we can **send to props our message streams**.

We send them as a function that push it's argument to the stream (with helper `createPushMessageFunctions()`) and that doesn't have to know about state, store or next(). It's similar or even identical to `bindActionsCreators` - they do not know about `dispatch`, too.

Now our component gets `itemsSelected` (array) and `userSelected` (function) as props. You know what to do with them. You can have something like `onClick={ userSelected('A') }` on your button or so. Simple!


### How is `connectWithState` implemented?

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
      // we got are the same as previous (3)
      // (::this.setState) is ES7 syntax -
      // like shortcut of (data) => setState(data))
      // and subscribe (4) to actually get all of this.
      componentWillMount() {
        this.subscription = this.state$      //1
        .map(selector)                       //2
        .distinctUntilChanged((a, b) => deepEqual(a, b)) //3
        .subscribe(::this.setState);         //4
      }

      // we want to unsubscribe on unmount
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

App (index.js) is pretty straightforward (I duplicated some code from above for clarity and reducer is single, without combining ):

```javascript
import React from 'react';
import { render } from 'react-dom';
import Rx from 'rxjs';
import { createState, createMessageStreams } from 'rxr';
import { Provider } from 'rxr-react';

const messageStreams = createMessageStreams('userSelected');
//                     ^^^ this basically creates:
// messageStreams = {
//   userSelected$: new Rx.Subject,
//   userSelected: (val) => userSelected$.next(val)
// }

const userReducer$ = messageStreams.userSelected$
  .map(item => (state) => ({ itemsSelected: state.itemsSelected.push(item) }));

const initialState = { itemsSelected: [] };
const state$ = createState(userReducer$, initialState);

render(
  <Provider state$={ state$ }>
    <App />
  </Provider>, document.getElementById('index')
);
```

Yep. I'll add more examples, soon.

# App mail file (index.js)

## Redux way

```javascript
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
// this is for async loading
import thunkMiddleware from 'redux-thunk';
// we use css modules
import styles from './index.css';

// our reducers
import reducers from './reducers';

// and the usual createStore
const store = createStore(
  reducers,
  applyMiddleware(
    thunkMiddleware
  )
);

import App from './components/App';

render((
  <Provider store={store}>
    <App />
  </Provider>)
  , document.getElementById('index')
);
```

## RxR way

```javascript
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'rxr-react';
import { createState, createLoggerStream, startLogging, messageStreamsMonitor$ } from 'rxr';

import styles from './index.css';

import App from './components/App';

// our RxR reducers
import reducer$ from './reducers';

// we create initial state here
const initialState = {
  clients:        { data: [], ts: 0, status: undefined },
  filter:         '',
  selectedClient: '',
};

// and because in RxR is no need of store, we create state directly
const state$ = createState(reducer$, initialState);

// we will log all state changes  and messageStreams events to console
const loggerStream$ = createLoggerStream(state$, messageStreamsMonitor$);
startLogging(loggerStream$);

// RxR-React provides similar Provider component as React-Redux
render(
  <Provider state$={ state$ }>
    <App />
  </Provider>, document.getElementById('index')
);

```

_**Q:** Why are some variables here with '$' on the end?_

_**A:** Some use this as a convention to signalize that this value stores Observable stream. We will use it here, too._

The structure is pretty the similar.

In RxR there is no need for `thunkMiddleware`, because RxJS (what is behind RxR) has a pretty nice async handling.

In Redux initial state is created within reducers.

In RxR (as you can learn from [RxR gitbook](https://dacz.github.io/rxr/)) the reducer doesn't produce new state (as in Redux) but in RxR it produces function how to make this new state (from previous state). Don't worry if it is puzzling for now (it is explained in the [ebook in detail](https://dacz.github.io/rxr/)).

Redux creates store. Store is container with state and dispatch (and little bit more).

RxR creates state stream. It is `Rx.Observable`. It is like pipe that gives you new value every time the state changes. Redux store has `getState` that gives you current state when you need it.

We are passing (store or state$ via React context to the app. Same. Nice.

---

Usually first you create **actions** in Redux (or **message streams** in RxR) so [let's look at them ... &raquo;](./actions.md)

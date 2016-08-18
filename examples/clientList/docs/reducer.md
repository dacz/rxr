# Reducer

## Redux way first again...

Keep in mind - Redux reducer is pure function.

Actually we have 3 reducers and we split them into 3 files:

```javascript
// filter.js
import { SET_FILTER } from '../actions/actions-constants';

const filter = (state = '', action) => {
  if (!action || !action.type) return state;
  switch (action.type) {
    case SET_FILTER: return action.payload;
    default: return state;
  }
};

export default filter;
```

```javascript
//selectedClient.js
import { SELECT_CLIENT } from '../actions/actions-constants';

const selectedClient = (state = '', action) => {
  if (!action || !action.type) return state;
  switch (action.type) {
    case SELECT_CLIENT: {
      const payload = !!action.payload ? action.payload : '';
      if (typeof payload === 'string') return payload;
      return state;
    }
    default: return state;
  }
};

export default selectedClient;
```

and

```javascript
// clients.js
import {
  RECEIVED_INITIAL_CLIENTS_DATA,
  CLIENTS_DATA_LOADING,
} from '../actions/actions-constants';
import {
  IS_LOADING,
} from '../utils/constants';

const clients = (state, action) => {
  state = state || {
    data:   [],
    status: undefined,
  };
  if (!action || !action.type) return state;

  switch (action.type) {
    case RECEIVED_INITIAL_CLIENTS_DATA: {
      if (action.error) {
        const err = typeof action.error === 'object' ? action.error.message : action.error;
        return { ...state, status: err, ts: action.ts };
      }
      if (Array.isArray(action.payload)) {
        return { ...state, clients: { data, status: undefined, ts: action.ts } };
      }
      return state;
    }
    case CLIENTS_DATA_LOADING: return { ...state, status: IS_LOADING, ts: action.ts };
    default: return state;
  }
};

export default clients;
```

and making one reducer

```javascript
// reducers/index.js
import { combineReducers } from 'redux';
import clients from './clients';
import filter from './filter';
import selectedClient from './selectedClient';

const reducer = combineReducers({
  clients,
  filter,
  selectedClient,
});

export default reducer;
```

State is immutable. We use object spread operator (thanks Babel) to make it easier.

Every Redux reducer define initial state. This is difference from RxR - we defined initial state in `index.js`.

Every reducer has some overhead with all the `switch` statements to find the corresponding action that belongs to them.


## RxR way

We put it in just one file:

```javascript
import { combineReducers } from 'rxr';
import actionStreams from '../actions';
import {
  IS_LOADING,
  CLIENTS_DATA_URL,
} from '../utils/constants';
import asyncFetchDataRx from '../utils/asyncFetchDataRx';

// each reducer is "connected" to corresponding message stream.
// this makes it more straightforward (IMHO)
// the main difference: RxR reducer doesn't return new state but the function
// that may be used to create new state.

const clientsDataLoadingReducer$ = actionStreams.clientsDataLoading$
  .map((ts) => state => ({ ...state, clients: { ...state.clients, status: IS_LOADING, ts } }));

const setFilterReducer$ = actionStreams.setFilter$
  .map((val = '') => state => ({ ...state, filter: val }));

const selectClientReducer$ = actionStreams.selectClient$
  .map((id = '') => state => ({ ...state, selectedClient: id.toString() }));

const receivedClientsDataReducer$ = actionStreams.receivedClientsData$
  .map(({ data, error, ts }) => state => {
    if (error) {
      const err = typeof error === 'object' ? error.message : error;
      return { ...state, clients: { ...state.clients, status: err, ts } };
    }
    if (Array.isArray(data)) {
      return { ...state, clients: { data, status: undefined, ts } };
    }
    return state;
  });

const fetchClientsReducer$ = actionStreams.fetchClients$
  .flatMap((url = CLIENTS_DATA_URL) => {
    const ts = Date.now();
    // notify about the loading
    actionStreams.clientsDataLoading$.next(ts);
    return asyncFetchDataRx(url);
  }).map(val => {
    const ts = Date.now();
    const error = (val instanceof Error) ? val.message : undefined;
    const data = error ? undefined : val;
    // update state
    actionStreams.receivedClientsData$.next({ data, error, ts });
    return (state) => state;
  });


// we combine the reducers to one stream
const reducer$ = combineReducers([
  clientsDataLoadingReducer$,
  setFilterReducer$,
  selectClientReducer$,
  receivedClientsDataReducer$,
  fetchClientsReducer$
]);

export default reducer$;
```
### What is the output?

First significant difference is that RxR reducers (if we will use this name) are **connected directly to corresponding message stream**. We do not need the `switch` statements. Consider it as another transformation function on the stream (chain/pipe/you name it). This difference helps us to tidy up corresponding code comparing to Redux.

Second difference is that transformation within RxR reducer doesn't return new state. It makes sense - all the stream still doesn't know the current state. **It returns the function that takes state as an argument and creates new state.** It may seem to be difficult but have a look at the corresponding code in Redux reducer and RxR reducer stream. They are logically identical (with one small difference as we will see). This is huge benefit when we want to rewrite the app. No brand new functions or concepts.

### State parts

**Significant difference is scoping the state**. Each Redux reducer manages it's own part of the state. It doesn't know about the whole state structure. This is big benefit of Redux - it allows to compose. On the other side RxR reducer have to work with the whole state structure. I want to figure out the way how to make it (optionally) composable the same way as Redux.

On the other side this may be considered as benefit. One disadvantage od Redux "sub-stating" is that it is not trivial to use libraries as Immutable (to manage the whole state as one Immutable object). With RxR it is easy, because we are still working with the whole state object (so far functions that modify the whole state object).

Let's see what does it mean:

In Redux you can see corresponding state changing function eg. in `filter.js` reducer:

```javascript
// ...
case SET_FILTER: return action.payload;
// ...
```

Because this reducer manages just simple state - value of the filter.

In RxR, the similar part is:

```javascript
//...
actionStreams.setFilter$.map((val = '') => state => ({ ...state, filter: val }));
//...
```

As you can see we have to use spread object operator to modify only filter part. It's not a big deal I think. It may become more difficult if you use deeper nesting of Redux reducers (but honestly - are you able to keep mental model of it in your head? And figure out how to use Immutable?)

### Pure?

Let's look into last difference. Redux defines reducer as a strictly pure function. Our "reducer-like" approach is not pure for 2 reasons. One is using `Date.now()` within the code. Ok, we could manage it by requiring the timestamp be part of the input into the message stream. Like you would require `ts` as an argument to the `receivedClientsData` stream together with data. But it doesn't solve it - this is again part of the reducer stream. Redux solved it putting it into action creator. They have not be pure. Why they have not and reducer have to? It's just the convention.

We can be "clever" and say: we do nothing against the Redux principles. Is it a lie? No. Citation from [Redux documentation](http://redux.js.org/docs/introduction/ThreePrinciples.html):

> Changes are made with pure functions

True is we are **not making changes to the state** in our reducer (maybe we should stop using name out RxR counterpart "reducer"). Yes - we are just **producing function** that will ultimately **do the change of the state** (create new state, to be correct). And we can put the same convention to our functions like is in Redux - the functions we are producing in this reducer-like stream transformation (we have to find better name :)) are pure. Because they **are the same like we do in Redux example!**

---

What next? Let's have a [short look at the `createState` we have in the main file `index.js` ... &raquo;](./createState.md)

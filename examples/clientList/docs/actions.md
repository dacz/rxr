# Actions

## Redux first

We have actions constants:

```javascript
// action-constants.js
export const RECEIVED_INITIAL_CLIENTS_DATA = 'RECEIVED_DATA';
export const SET_FILTER = 'SET_FILTER';
export const SELECT_CLIENT = 'SELECT_CLIENT';
export const CLIENTS_DATA_LOADING = 'CLIENTS_DATA_LOADING';
```

and then the actions creators

```javascript
import fetch from 'isomorphic-fetch';
// we want to be organized and have order in constants, right?
import {
  RECEIVED_INITIAL_CLIENTS_DATA,
  SET_FILTER,
  SELECT_CLIENT,
  CLIENTS_DATA_LOADING,
} from './actions-constants';
import {
  OUTDATED_LOADING,
  CLIENTS_DATA_URL,
} from '../utils/constants';

export const receivedInitialClientsData = (json, err) => (
  {
    type:    RECEIVED_INITIAL_CLIENTS_DATA,
    payload: json,
    error:   err,
    ts:      Date.now(),
  }
);

export const clientsDataLoading = () => (
  {
    type: CLIENTS_DATA_LOADING,
    ts:   Date.now(),
  }
);

export const setFilter = (str) => (
  {
    type:    SET_FILTER,
    payload: str,
  }
);

export const selectClient = (id) => (
  {
    type:    SELECT_CLIENT,
    payload: id,
  }
);

// ---- ASYNC ----

const fetchData = (dispatch) => fetch(CLIENTS_DATA_URL)
  .then(response => response.json())
  .then(json => dispatch(receivedInitialClientsData(json)))
  .catch(err => dispatch(receivedInitialClientsData(undefined, err)));

export const fetchClients = () => (dispatch, getState) => {
  if (Date.now() - getState().clients.ts < OUTDATED_LOADING) return Promise.resolve(); //1
  dispatch(clientsDataLoading());
  return fetchData(dispatch);
};
```

First four action creators are straightforward.

Then here is the async action creator `fetchClients` that doesn't return object but function. This is where atypical behavior appears within the standard action flow in Redux. This is the moment where the `thunkMiddleware` steps in and catch this action before it reaches reducers and process it. Here it decides if it is needed to load the data (//1), then dispatch the standard action `clientsDataLoading` to signalize that the data are loading and actually fetch the data. After data arrive (and are parsed ok), the standard action `receivedInitialClientsData` is dispatched.

The async function (thunk) needs the `dispatch` so the can call it.


## The RxR actions

```javascript
import { createMessageStreams } from 'rxr';

const actionStreams = createMessageStreams([
  'clientsDataLoading',
  'setFilter',
  'selectClient',
  'receivedClientsData',
  'fetchClients'
]);

export default actionStreams;
```

Where is the async logic and actions formats? And what it creates?

What it does is [described in detail here](https://dacz.github.io/rxr/docs/basics/ActionsStreams.html).

Basically - `actionStreams` is an object that contains pairs of keys like `clientsDataLoadingS` and `clientsDataLoading` ... for all items from the array passed into `createMessageStreams`.

The `clientsDataLoadingS` is `Rx.Subject` that means that it is observer (you can put/pipe something into it) and at the same time is it observable - anything that will subscribe to it's values will get this "something" piped into it.

Because the way how to put new value into Subject is to call `clientsDataLoadingS.next(value)`, the second key created by `createMessageStreams` for this item is plain `clientsDataLoading`. This is just syntactic sugar - when you call `clientsDataLoading(value)`, it is the same as calling the `clientsDataLoadingS.next(value)`.

So in the `actionStreams` is 10 keys ... 5 pairs for each item of the array.

Simple. And you can clearly see in this file all action creators ... or in RxR **message streams**.

Why it doesn't describe messages like Redux - with action.type etc?

Again ... [details here](https://dacz.github.io/rxr/docs/basics/ActionsStreams.html) but shortly - because in RxR the messages doesn't travel to every reducer, but they are passed to the right message stream (aka pipe) directly. Stream of `selectClients` data for example (like 'selected A', then 'selected R', ...).

Less typing in RxR and nice overview of all message streams (aka action creators from Redux).

Let's go on.

---

Interested in reducers? [Here they are... &raquo;](./reducer.md)

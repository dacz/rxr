// import Rx from 'rxjs';
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

const clientsDataLoadingreducerS = actionStreams.clientsDataLoadingS
  .map((ts) => state => ({ ...state, clients: { ...state.clients, status: IS_LOADING, ts } }));

const setFilterreducerS = actionStreams.setFilterS
  .map((val = '') => state => ({ ...state, filter: val }));

const selectClientreducerS = actionStreams.selectClientS
  .map((id = '') => state => ({ ...state, selectedClient: id.toString() }));

const receivedClientsDatareducerS = actionStreams.receivedClientsDataS
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

// we have to use flatMap here because
// the asyncFetchDataRx() function returns Observable.fromPromise
// and it is metastream that we have to flatten
const fetchClientsreducerS = actionStreams.fetchClientsS
  .flatMap((url = CLIENTS_DATA_URL) => {
    const ts = Date.now();
    // notify about the loading
    actionStreams.clientsDataLoadingS.next(ts);
    return asyncFetchDataRx(url);
  }).map(val => {
    const ts = Date.now();
    const error = (val instanceof Error) ? val.message : undefined;
    const data = error ? undefined : val;
    // update state
    actionStreams.receivedClientsDataS.next({ data, error, ts });
    return (state) => state;
  });

// we combine the reducers to one stream
const reducerS = combineReducers([
  clientsDataLoadingreducerS,
  setFilterreducerS,
  selectClientreducerS,
  receivedClientsDatareducerS,
  fetchClientsreducerS
]);

export default reducerS;

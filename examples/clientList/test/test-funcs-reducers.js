import test from 'ava';
import * as reducer from '../src/funcs/reducers';
import {
  IS_LOADING
} from '../src/utils/constants';


// export const clientsDataLoadingReducer = (ts) =>
//   state => ({ ...state, status: IS_LOADING, ts });
test('clientsDataLoadingReducer', t => {
  const state = { data: [], status: undefined };
  const ts = Date.now();
  const reducerFn = reducer.clientsDataLoadingReducer(ts);
  t.is(typeof reducerFn, 'function');
  const newState = reducerFn(state);
  t.is(state.data, newState.data);
  t.is(newState.status, IS_LOADING);
  t.is(newState.ts, ts);
});


// setFilterReducer = (val = '') => () => val;
test('setFilterReducer', t => {
  const val = 'someval';
  const reducerFn = reducer.setFilterReducer(val);
  t.is(typeof reducerFn, 'function');
  const newState = reducerFn();
  t.is(newState, val);
});


// selectClientReducer = (id = '') => () => id.toString();
test('selectClientReducer', t => {
  const val = 'someclient';
  const reducerFn = reducer.selectClientReducer(val);
  t.is(typeof reducerFn, 'function');
  const newState = reducerFn();
  t.is(newState, val);
});

test('selectClientReducer as a number', t => {
  const val = 5;
  const reducerFn = reducer.selectClientReducer(val);
  t.is(typeof reducerFn, 'function');
  const newState = reducerFn();
  t.is(newState, val.toString());
});


// receivedClientsDataReducer = ({ data, error, ts })
test('receivedClientsDataReducer', t => {
  const state = { data: [], status: IS_LOADING };
  const data = [ { a: 'A' }, { b: 'B' } ];
  const ts = Date.now();
  const reducerFn = reducer.receivedClientsDataReducer({ data, error: undefined, ts });
  t.is(typeof reducerFn, 'function');
  const newState = reducerFn(state);
  t.is(newState.status, undefined);
  t.is(newState.ts, ts);
  t.deepEqual(newState.data, data);
});

test('receivedClientsDataReducer with error', t => {
  const data = [ { a: 'A' }, { b: 'B' } ];
  const state = { data, status: IS_LOADING };
  const ts = Date.now();
  const errorMessage = 'loading error';
  const error = new Error(errorMessage);
  const reducerFn = reducer.receivedClientsDataReducer({ data, error, ts });
  t.is(typeof reducerFn, 'function');
  const newState = reducerFn(state);
  t.is(newState.status, errorMessage);
  t.is(newState.ts, ts);
  t.deepEqual(newState.data, data);
});

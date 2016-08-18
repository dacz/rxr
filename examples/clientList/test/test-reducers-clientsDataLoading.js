import test from 'ava';
import actions from '../src/actions';
import reducer$ from '../src/reducers';
import {
  IS_LOADING,
} from '../src/utils/constants';


test('clientsDataLoading$', t => {
  const initialState = {};
  const ts = Date.now();
  const valWanted = [
    { clients: { status: IS_LOADING, ts } },
  ];
  reducer$.subscribe(fn => {
    t.deepEqual(fn(initialState), valWanted.shift());
  });

  actions.clientsDataLoading$.next(ts);
});

test('clientsDataLoading$ previous data', t => {
  const ts = Date.now();
  const initialState = {
    clients: { status: undefined, ts: ts - 10000, data: [] },
    filter:  'somefilter',
  };
  const valWanted = [
    {
      clients: { status: IS_LOADING, ts, data: initialState.clients.data },
      filter:  initialState.filter,
    },
  ];
  reducer$.subscribe(fn => {
    t.deepEqual(fn(initialState), valWanted.shift());
  });

  actions.clientsDataLoading$.next(ts);
});

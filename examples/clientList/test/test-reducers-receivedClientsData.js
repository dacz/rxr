import test from 'ava';
import actions from '../src/actions';
import reducer$ from '../src/reducers';
import clients from '../assets/clients.json';


test('receivedClientsData$', t => {
  const initialState = {};
  const ts = Date.now();

  reducer$.subscribe(fn => {
    const clientsState = fn(initialState).clients;
    t.is(clientsState.data.length, clients.length);
    t.is(clientsState.ts, ts);
    t.is(clientsState.status, undefined);
    t.is(clientsState.error, undefined);
  });

  const error = undefined;
  actions.receivedClientsData$.next({ data: clients, error, ts });
});

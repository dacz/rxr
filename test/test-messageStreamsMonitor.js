import test from 'ava';
import isObservable from 'is-observable';
import messageStreamsMonitor$ from '../src/messageStreamsMonitor';


test('create', t => {
  t.true(isObservable(messageStreamsMonitor$));
  t.true(typeof messageStreamsMonitor$.next === 'function');
});

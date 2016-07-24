import test from 'ava';
import Rx from 'rxjs';
import isObservable from 'is-observable';
import messageStreamsMonitor$ from '../src/messageStreamsMonitor';


test('create', t => {
  t.true(isObservable(messageStreamsMonitor$));
  t.true(typeof messageStreamsMonitor$.next === 'function');
});

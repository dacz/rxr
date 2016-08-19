import test from 'ava';
import isObservable from 'is-observable';
import messageStreamsMonitorS from '../src/messageStreamsMonitor';


test('create', t => {
  t.true(isObservable(messageStreamsMonitorS));
  t.true(typeof messageStreamsMonitorS.next === 'function');
});

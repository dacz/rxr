import test from 'ava';
import Rx from 'rxjs';
import { subscribeExpect } from './helpers';
import wrapByMonitor from '../src/wrapByMonitor';

test('wrapByMonitor', t => {
  t.plan(7);
  const inVal = [ 1, 33, { some: 'value' } ];
  const obsS = Rx.Observable.from(inVal);
  const monitorS = new Rx.Subject;
  const streamName = 'someStreamName';
  const want = inVal.map(i => ({ streamName, payload: i }));
  const wrapped = wrapByMonitor(streamName, obsS, monitorS);
  t.false(obsS === wrapped);
  subscribeExpect(t, monitorS, want);
  subscribeExpect(t, wrapped, inVal);
});

test('wrapByMonitor - no monitor', t => {
  const obsS = Rx.Observable.of(1, 2);
  const streamName = 'someName';
  t.throws(() => wrapByMonitor(streamName, obsS, undefined));
});

test('wrapByMonitor - no observable', t => {
  const monitorS = new Rx.Subject;
  const obsS = 'bla';
  const streamName = 'someName';
  t.throws(() => wrapByMonitor(streamName, obsS, monitorS));
});

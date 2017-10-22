import Rx from 'rxjs';
import createLoggerStream from '../src/createLoggerStream';
import isObservable from 'is-observable';
import test from 'ava';

test('create with just state', t => {
  t.plan(3);
  const states = [{ some: 'state' }, { someOther: 'other state' }];
  const statesCopy = [].concat(states);
  const state$ = Rx.Observable.from(states);
  const loggerStream$ = createLoggerStream(state$);

  t.true(isObservable(loggerStream$));

  return loggerStream$.subscribe(val => {
    t.deepEqual(val, { streamName: 'state', payload: statesCopy.shift() });
  });
});

test('create with state and messageStream monitor', t => {
  t.plan(5);
  const states = [{ some: 'state' }, { someOther: 'other state' }];
  const streamEvents = [
    { streamName: 'stream1', payload: 'ahoj' },
    { streamName: 'stream2', payload: { some: 'object' } },
  ];
  const wantMonitor = states
    .map(item => ({ streamName: 'state', payload: item }))
    .concat(streamEvents);

  const state$ = Rx.Observable.from(states);
  const streamEvents$ = Rx.Observable.from(streamEvents);
  const loggerStream$ = createLoggerStream(state$, streamEvents$);

  t.true(isObservable(loggerStream$));

  return loggerStream$.subscribe(val => {
    t.deepEqual(val, wantMonitor.shift());
  });
});

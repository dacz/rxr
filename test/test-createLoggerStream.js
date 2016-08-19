import test from 'ava';
import Rx from 'rxjs';
import isObservable from 'is-observable';
import createLoggerStream from '../src/createLoggerStream';


test('create with just state', t => {
  t.plan(3);
  const states = [
    { some: 'state' },
    { someOther: 'other state' }
  ];
  const statesCopy = [].concat(states);
  const stateS = Rx.Observable.from(states);
  const loggerStreamS = createLoggerStream(stateS);

  t.true(isObservable(loggerStreamS));

  return loggerStreamS.subscribe(val => {
    t.deepEqual(val, { streamName: 'state', payload: statesCopy.shift() });
  });
});


test('create with state and messageStream monitor', t => {
  t.plan(5);
  const states = [
    { some: 'state' },
    { someOther: 'other state' }
  ];
  const streamEvents = [
    { streamName: 'stream1', payload: 'ahoj' },
    { streamName: 'stream2', payload: { some: 'object' } },
  ];
  const wantMonitor = states
    .map(item => ({ streamName: 'state', payload: item }))
    .concat(streamEvents);

  const stateS = Rx.Observable.from(states);
  const streamEventsS = Rx.Observable.from(streamEvents);
  const loggerStreamS = createLoggerStream(stateS, streamEventsS);

  t.true(isObservable(loggerStreamS));

  return loggerStreamS.subscribe(val => {
    t.deepEqual(val, wantMonitor.shift());
  });
});

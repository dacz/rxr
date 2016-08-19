import test from 'ava';
import Rx from 'rxjs';
import isObservable from 'is-observable';
import createMessageStreams from '../src/createMessageStreams';


test('create message stream with single name', t => {
  const name = 'stream1';
  const messageStreams = createMessageStreams(name);

  const nameStreamKey = `${name}$`;
  t.true(isObservable(messageStreams[nameStreamKey]));
  t.is(messageStreams[nameStreamKey].streamName, nameStreamKey);
  t.true(typeof messageStreams[nameStreamKey].next === 'function');
  t.true(typeof messageStreams[name] === 'function');
});


test('create message stream with array', t => {
  const names = [
    'stream1',
    'stream2',
  ];
  const messageStreams = createMessageStreams(names);

  names.forEach(name => {
    const nameStreamKey = `${name}$`;
    t.true(isObservable(messageStreams[nameStreamKey]));
    t.is(messageStreams[nameStreamKey].streamName, nameStreamKey);
    t.true(typeof messageStreams[nameStreamKey].next === 'function');
    t.true(typeof messageStreams[name] === 'function');
  });
});


test('do not create message stream functions', t => {
  const names = [
    'stream1',
    'stream2',
  ];
  const messageStreams = createMessageStreams(names, { makePushMessageFunctions: false });

  names.forEach(name => {
    const nameStreamKey = `${name}$`;
    t.true(isObservable(messageStreams[nameStreamKey]));
    t.is(messageStreams[nameStreamKey].streamName, nameStreamKey);
    t.falsy(messageStreams[name]);
  });
});


test('create message stream with logger functions', t => {
  t.plan(10);

  const wantVals = [
    { streamName: 'stream1', payload: 'ahoj' },
    { streamName: 'stream2', payload: [ 1, 2, 3 ] },
    { streamName: 'stream1', payload: 42 },
    { streamName: 'stream2', payload: { some: 'Object' } }
  ];
  const wantValsCopy = [].concat(wantVals);

  // const monitorStreamS = new Rx.Subject;
  const messageStreamsMonitorS = Rx.Observable.from(wantVals);

  const names = [
    'stream1',
    'stream2',
  ];
  const messageStreams = createMessageStreams(names, { messageStreamsMonitorS });

  names.forEach(name => {
    const nameStreamKey = `${name}$`;
    t.true(isObservable(messageStreams[nameStreamKey]));
    t.is(messageStreams[nameStreamKey].streamName, nameStreamKey);
    t.true(typeof messageStreams[name] === 'function');
  });

  return messageStreamsMonitorS.do(val => {
    t.deepEqual(val, wantValsCopy.shift());
  });
});

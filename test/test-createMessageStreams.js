import test from 'ava';
import isObservable from 'is-observable';
import createMessageStreams from '../src/createMessageStreams';


test('create message stream with single name', t => {
  const name = 'stream1';
  const messageStreams = createMessageStreams(name);

  const nameStreamKey = `${name}$`;
  t.true(isObservable(messageStreams[nameStreamKey]));
  t.true(typeof messageStreams[nameStreamKey].next === 'function');
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
    t.true(typeof messageStreams[nameStreamKey].next === 'function');
  });
});

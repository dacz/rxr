import Rx from 'rxjs';
import isObservable from 'is-observable';
import test from 'ava';
import * as helpers from '../src/utils/helpers';
import { subjectHelper, subscribeExpect, pushToSubject } from './helpers';


test('initAction', t => {
  t.plan(6);
  const action = helpers.initAction();
  t.true(isObservable(action.streamS));
  t.true(typeof action.streamS.next === 'function');
  t.true(typeof action.func === 'function');
  const want = [ 1, 'h', { a: 'some' } ];
  subjectHelper(t, action.streamS, want, want);
});


test('initActions', t => {
  t.plan(6);
  const actions = {
    action1: { some: 'value1' },
    action2: { some: 'other1' }
  };
  const createdActions = helpers.initActions(actions);
  t.true(isObservable(createdActions.action1.streamS));
  t.true(typeof createdActions.action1.streamS.next === 'function');
  t.true(typeof createdActions.action1.func === 'function');
  t.true(isObservable(createdActions.action2.streamS));
  t.true(typeof createdActions.action2.streamS.next === 'function');
  t.true(typeof createdActions.action2.func === 'function');
});


test('wrapByMonitor', t => {
  t.plan(7);
  const inVal = [ 1, 33, { some: 'value' } ];
  const obsS = Rx.Observable.from(inVal);
  const monitorS = new Rx.Subject;
  const streamName = 'someStreamName';
  const want = inVal.map(i => [ streamName, i ]);
  const wrapped = helpers.wrapByMonitor(streamName, obsS, monitorS);
  t.false(obsS === wrapped);
  subscribeExpect(t, monitorS, want);
  subscribeExpect(t, wrapped, inVal);
});

test('wrapByMonitor - no monitor', t => {
  t.plan(4);
  const inVal = [ 1, 33, { some: 'value' } ];
  const obsS = Rx.Observable.from(inVal);
  const monitorS = undefined;
  const streamName = 'someStreamName';
  const wrapped = helpers.wrapByMonitor(streamName, obsS, monitorS);
  t.true(obsS === wrapped);
  subscribeExpect(t, wrapped, inVal);
});


test('makePipedStream', t => {
  t.plan(3);
  const ftrans = (i) => [ i, i ];
  const fn = (obs) => obs.map(ftrans);
  const obsS = new Rx.Subject;
  const pipedS = helpers.makePipedStream(obsS, fn);
  const inVal = [ 1, 'a', { some: 'value' } ];
  const want = inVal.map(ftrans);
  subscribeExpect(t, pipedS, want);
  pushToSubject(obsS, inVal);
});

test('makePipedStream - not observable out', t => {
  t.plan(1);
  const fn = () => 1;
  const obsS = new Rx.Subject;
  t.throws(() => helpers.makePipedStream(obsS, fn));
});



test('getFunc', t => {
  const fname = 'someFunc';
  const functions = {
    someFunc:  () => {},
    otherFunc: () => {},
  };
  const func = helpers.getFunc(fname, functions);
  t.is(func, functions.someFunc);
});

test('getFunc - not a string', t => {
  t.plan(1);
  const functions = {
    someFunc:  () => {},
    otherFunc: () => {},
  };
  const fname = () => {};
  t.throws(() => helpers.getFunc(fname, functions));
});

test('getFunc - not in a functions', t => {
  t.plan(1);
  const functions = {
    someFunc:  () => {},
    otherFunc: () => {},
  };
  const fname = 'someithername';
  t.throws(() => helpers.getFunc(fname, functions));
});

test('getFunc - in functions but not a functions', t => {
  t.plan(1);
  const functions = {
    someFunc:  'hulu',
    otherFunc: () => {},
  };
  const fname = 'someFunc';
  t.throws(() => helpers.getFunc(fname, functions));
});



test('setupAction', t => {
  const appName = 'appName1';
  const streamName = 'streamA';
  const subj = new Rx.Subject;
  const fname = 'someFunc';
  const ftrans = (i) => i * 2;
  const fn = (obs) => obs.map(ftrans);
  const functions = {
    someFunc:  fn,
    otherFunc: () => {},
  };
  const monitorS = new Rx.Subject;
  const preReducerS = helpers.setupAction(appName, streamName, subj, fname, functions, monitorS);

  const inVal = [ 1, 4, 21 ];
  const wantVals = inVal.map(ftrans);
  const wantMonitor = wantVals.map(i => [ `${appName}:${streamName}`, i ]);
  t.plan(6);
  subscribeExpect(t, monitorS, wantMonitor);
  subscribeExpect(t, preReducerS, wantVals);
  pushToSubject(subj, inVal);
});


test('setupAction - no monitor', t => {
  const appName = 'appName1';
  const streamName = 'streamA';
  const subj = new Rx.Subject;
  const fname = 'someFunc';
  const ftrans = (i) => i * 2;
  const fn = (obs) => obs.map(ftrans);
  // const fntrans = (i) => i * 2;
  const functions = {
    someFunc:  fn,
    otherFunc: () => {},
  };
  const preReducerS = helpers.setupAction(appName, streamName, subj, fname, functions, undefined);

  const inVal = [ 1, 4, 21 ];
  const wantVals = inVal.map(ftrans);
  t.plan(3);
  subscribeExpect(t, preReducerS, wantVals);
  pushToSubject(subj, inVal);
});


test('setupAction - no func', t => {
  const appName = 'appName1';
  const streamName = 'streamA';
  const subj = new Rx.Subject;
  const fname = undefined;
  const ftrans = (i) => i * 2;
  const fn = (obs) => obs.map(ftrans);
  // const fntrans = (i) => i * 2;
  const functions = {
    someFunc:  fn,
    otherFunc: () => {},
  };
  const monitorS = new Rx.Subject;
  const preReducerS = helpers.setupAction(appName, streamName, subj, fname, functions, monitorS);

  const inVal = [ 1, 4, 21 ];
  const wantVals = inVal;
  const wantMonitor = wantVals.map(i => [ `${appName}:${streamName}`, i ]);
  t.plan(6);
  subscribeExpect(t, monitorS, wantMonitor);
  subscribeExpect(t, preReducerS, wantVals);
  pushToSubject(subj, inVal);
});


test('setupAction - wrong function name', t => {
  const appName = 'appName1';
  const streamName = 'streamA';
  const subj = new Rx.Subject;
  const fname = 'someFuncXX';
  const ftrans = (i) => i * 2;
  const fn = (obs) => obs.map(ftrans);
  // const fntrans = (i) => i * 2;
  const functions = {
    someFunc:  fn,
    otherFunc: () => {},
  };
  const monitorS = new Rx.Subject;
  t.throws(() => helpers.setupAction(appName, streamName, subj, fname, functions, monitorS));
});


test('setupAction - wrong function', t => {
  const appName = 'appName1';
  const streamName = 'streamA';
  const subj = new Rx.Subject;
  const fname = 'someFunc';
  const fn = (val) => val + 2;
  // const fntrans = (i) => i * 2;
  const functions = {
    someFunc:  fn,
    otherFunc: () => {},
  };
  const monitorS = new Rx.Subject;
  t.throws(() => helpers.setupAction(appName, streamName, subj, fname, functions, monitorS));
});



test('flattenArray', t => {
  const valIn = [ 'a', [ 'b', 'c' ]];
  const want = [ 'a', 'b', 'c' ];
  t.deepEqual(helpers.flattenArray(valIn), want);
});

test('flattenArray - both arrays', t => {
  const valIn = [[ 'a', 'b' ], [ 'B', 'C' ]];
  const want = [ 'a', 'b', 'B', 'C' ];
  t.deepEqual(helpers.flattenArray(valIn), want);
});


test('normalizeScope', t => {
  const valIn = [ 'a', [ 'b', 'c' ]];
  const want = [ 'a', 'b', 'c' ];
  t.deepEqual(helpers.normalizeScope(valIn), want);
});

test('normalizeScope - both arrays', t => {
  const valIn = [[ 'a', 'b' ], [ 'B', 'C' ]];
  const want = [ 'a', 'b', 'B', 'C' ];
  t.deepEqual(helpers.normalizeScope(valIn), want);
});

test('normalizeScope - undef app', t => {
  const valIn = [ undefined, [ 'b', 'c' ]];
  const want = [ 'b', 'c' ];
  t.deepEqual(helpers.normalizeScope(valIn), want);
});

test('normalizeScope - undefined stream', t => {
  const valIn = [ 'a', undefined ];
  const want = [ 'a' ];
  t.deepEqual(helpers.normalizeScope(valIn), want);
});

test('normalizeScope - undef app and stream', t => {
  const valIn = [ undefined, undefined ];
  const want = [];
  t.deepEqual(helpers.normalizeScope(valIn), want);
});


// export const scopeReducer = (scope, reducerS) =>
//   reducerS.map(func => [ normalizeScope(scope), func ]);
test('scopeReducer', t => {
  t.plan(2);
  const arrIn = [ 'a', { some: 'data' } ];
  const scope = [ 'stateSelect' ];
  const want = arrIn.map(i => [ scope, i ]);
  const subjS = new Rx.Subject;
  const scopedReducerS = helpers.scopeReducer(scope, subjS);
  subscribeExpect(t, scopedReducerS, want);
  pushToSubject(subjS, arrIn);
});

test('scopeReducer - no scope', t => {
  t.plan(2);
  const arrIn = [ 'a', { some: 'data' } ];
  const scope = [];
  const want = arrIn.map(i => [[], i ]);
  const subjS = new Rx.Subject;
  const scopedReducerS = helpers.scopeReducer(scope, subjS);
  subscribeExpect(t, scopedReducerS, want);
  pushToSubject(subjS, arrIn);
});


test.only('createReducer', t => {
  t.plan(4);
  const initState = 3;
  const myfn = (val) => val + initState;
  const fn = (val) => (state) => state + val;
  const obsS = new Rx.Subject;
  const reducerS = helpers.createReducer(obsS, fn);
  t.true(isObservable(reducerS));

  const valIn = [ 5, 7, 22 ];
  const valInCopy = [].concat(valIn);
  reducerS.subscribe(func => {
    t.is(func(initState), myfn(valInCopy.shift()));
  });
  pushToSubject(obsS, valIn);
});


// setupReducers
// may create reducer with default function name (if exists)
// may create reducer with specified function name
// may not create reducer at all


// --


// ----
//
// export const transformStreams = (keyName, obj) => Object.keys(obj)
// .reduce((acc, key) => {
//   acc[key] = { [keyName]: obj[key] };
//   return acc;
// }, {});
test.only('transformStreams', t => {
  const keyName = 'reducers';
  const obj = {
    some:  () => {},
    other: () => {},
  };
  const want = {
    some:  { [keyName]: obj.some },
    other: { [keyName]: obj.other },
  };
  const trans = helpers.transformStreams(keyName, obj);
  t.deepEqual(trans, want);
  Object.keys(trans).forEach(name => {
    t.is(trans[name][keyName], obj[name]);
  });
});

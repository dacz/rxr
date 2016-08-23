import Rx from 'rxjs';
import isObservable from 'is-observable';
import test from 'ava';
import blueprint from '../src/blueprint';
import * as helpers from '../src/utils/helpers';
import { subjectHelper, subscribeExpect, pushToSubject } from './helpers';
import appBlueprintExample from './helper-appBlueprintExample';
import functionsExample from './helper-functionsExample';
// import appBlueprintExampleOutput from './helper-appBlueprintExampleOutput';


test('initAction', t => {
  t.plan(6);
  const action = helpers.initAction();
  t.true(isObservable(action.streamS));
  t.true(typeof action.streamS.next === 'function');
  t.true(typeof action.func === 'function');
  const want = [ 1, 'h', { a: 'some' } ];
  subjectHelper(t, action.streamS, want, want);
});


test('wrapByMonitor', t => {
  t.plan(7);
  const inVal = [ 1, 33, { some: 'value' } ];
  const obsS = Rx.Observable.from(inVal);
  const monitorS = new Rx.Subject;
  const streamName = 'someStreamName';
  const want = inVal.map(i => ({ streamName, payload: i }));
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

test('conditionallyWrapByMonitor', t => {
  t.plan(7);
  const inVal = [ 1, 33, { some: 'value' } ];
  const monitorS = new Rx.Subject;
  const streamName = 'someStreamName';
  const want = inVal.map(i => ({ streamName, payload: i }));
  const action = {
    streamS: Rx.Observable.from(inVal),
  };
  const wrapped = helpers.conditionallyWrapByMonitor(streamName, action, monitorS);
  t.false(action.streamS === wrapped);
  subscribeExpect(t, monitorS, want);
  subscribeExpect(t, wrapped, inVal);
});

test('conditionallyWrapByMonitor - no wrap', t => {
  t.plan(4);
  const inVal = [ 1, 33, { some: 'value' } ];
  const monitorS = new Rx.Subject;
  const streamName = 'someStreamName';
  const action = {
    streamS: Rx.Observable.from(inVal),
    monitor: false
  };
  const wrapped = helpers.conditionallyWrapByMonitor(streamName, action, monitorS);
  t.true(action.streamS === wrapped);
  subscribeExpect(t, wrapped, inVal);
});


// streamNameForMonitor = (appName, streamName)
test('streamNameForMonitor', t => {
  const appName = 'someApp';
  const streamName = 'someStream';
  t.is(helpers.streamNameForMonitor(appName, streamName), 'someApp:someStream');
});



test('getFunc - string', t => {
  const fname = 'someFunc';
  const functions = {
    someFunc:  () => {},
    otherFunc: () => {},
  };
  const func = helpers.getFunc(fname, functions);
  const want = functions.someFunc;
  t.deepEqual(func, want);
});

test('getFunc - function', t => {
  const fname = () => () => {};
  const functions = {
    someFunc:  () => {},
    otherFunc: () => {},
  };
  const func = helpers.getFunc(fname, functions);
  t.deepEqual(func, fname);
});

test('getFunc - not a string or function', t => {
  t.plan(1);
  const functions = {
    someFunc:  () => {},
    otherFunc: () => {},
  };
  const fname = {};
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

test('getFunc - in functions but not a function', t => {
  t.plan(1);
  const functions = {
    someFunc:  'hulu',
    otherFunc: () => {},
  };
  const fname = 'someFunc';
  t.throws(() => helpers.getFunc(fname, functions));
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


test('createReducer', t => {
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



test('createActions', t => {
  // appBlueprintExample
  const appData = Object.assign({}, appBlueprintExample, {
    functions: functionsExample
  });
  const actions = helpers.createActions(appData);
  Object.keys(actions).forEach(actionName => {
    const action = actions[actionName];
    t.true(isObservable(action.streamS));
    t.true(isObservable(action.reducerS));
    t.is(typeof action.func, 'function');
  });
});



test('blueprint', t => {
  const app = blueprint(appBlueprintExample, { functions: functionsExample });
  t.true(isObservable(app.monitorS));
  t.true(isObservable(app.stateS));
  t.true(isObservable(app.reducerS));
});

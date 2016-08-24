import Rx from 'rxjs';
import isObservable from 'is-observable';
import test from 'ava';
import blueprint from '../src/blueprint';
import { subjectHelper, subscribeExpect, pushToSubject } from './helpers';
import {
  streamNameForMonitor
} from '../src/utils/helpers';
import appBlueprintExample from './helper-appBlueprintExample';
import functionsExample from './helper-functionsExample';

test('blueprint - test created streams', t => {
  const app = blueprint(appBlueprintExample, { functions: functionsExample });
  t.true(isObservable(app.monitorS));
  t.true(isObservable(app.stateS));
  t.true(isObservable(app.reducerS));
});


test('blueprint - test stateS', t => {
  const app = blueprint(appBlueprintExample, { functions: functionsExample });
  const inVal = [ 1, 'hulu' ];
  const inValInit = [ '', ...inVal ];
  const expState = inValInit.map((val) => ({ ...app.initialState, selectedClient: val }));
  t.plan(3);
  // app.stateS.subscribe(val => t.deepEqual(val, expState.shift()));
  subscribeExpect(t, app.stateS, expState);
  pushToSubject(app.actions.selectClient.streamS, inVal);
});


test('blueprint - test monitorS', t => {
  const app = blueprint(appBlueprintExample, { functions: functionsExample });
  const inVal = [ 1, 'hulu' ];
  const inValInit = [ '', ...inVal ];
  const expState = inValInit.map((val) => ({ ...app.initialState, selectedClient: val }));
  const expMonState = expState.map(val => ({
    streamName: streamNameForMonitor(app.appName, 'state'),
    payload:    val
  }));
  const expMonAction = inVal.map(val => ({
    streamName: streamNameForMonitor(app.appName, 'selectClient'),
    payload:    val
  }));
  const expMon = [
    expMonState[0],
    expMonAction[0],
    expMonState[1],
    expMonAction[1],
    expMonState[2]
  ]; // I'm not proud of this :)

  t.plan(5);
  app.monitorS.subscribe(val => {
    t.deepEqual(val, expMon.shift());
  });
  app.stateS.subscribe(() => {}); // to start the streams flowing
  pushToSubject(app.actions.selectClient.streamS, inVal);
});



test('blueprint - no monitor', t => {
  const appBp = { ...appBlueprintExample, monitor: false };
  const app = blueprint(appBp, { functions: functionsExample });
  t.false(isObservable(app.monitorS));
  t.true(isObservable(app.stateS));
  t.true(isObservable(app.reducerS));
});

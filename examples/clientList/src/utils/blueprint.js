import Rx from 'rxjs';
import { combineReducers, createScopedState } from 'rxr';
import deepmerge from 'deepmerge';

export const initAction = () => {
  const streamS = new Rx.Subject;
  return {
    streamS,
    func: streamS.next
  };
};

export const initActions = (actions) => Object.keys(actions)
  .reduce((acc, actionName) => {
    acc[actionName] = initAction();
    return acc;
  }, {});


const blueprintInit = (bp) => {
  const appInit = { appName: bp.appName || 'app' };

  const { actions, monitor } = bp;

  // create monitor
  appInit.monitorS = monitor ? new Rx.Subject : undefined;

  // create streams
  appInit.actions = initActions(actions);

  return appInit;
};

// ===================================
// ===================================
// ===================================
//

const wrapByMonitor = (streamName, obsS, monitorS) => (
  monitorS ? obsS.do((val) => monitorS.next([ streamName, val ])) : obsS
);

const makePipedStream = (obsS, fn) => fn(obsS);

const getFunc = (fname, functions) => {
  if (typeof fname !== 'string') {
    throw new Error(`blueprint.setupActions:
    pipe/reducer functions in blueprint are identified by name
    - they have to be string. Received: ${fname === null ? 'null' : typeof fname}
    Currently you can use only one, co if you need to do some composition,
    do it elsewhere and put here just the composed one.`);
  }
  if (!functions[fname] || typeof functions[fname] !== 'function') {
    throw new Error(`blueprint.setupActions: function specified in the blueprint
    was not provided within functions param passed to blueprintSetup
    or it is not a function: ${fname === null ? 'null' : typeof fname}`);
  }
  return functions[fname];
};

const setupAction = (appName, streamName, subj, fname, functions, monitorS) => {
  let preReducerS = subj;
  if (fname) {
    preReducerS = makePipedStream(preReducerS, getFunc(fname, functions));
  }
  if (monitorS) wrapByMonitor(`${appName}:${streamName}`, preReducerS, monitorS);
  return preReducerS;
};


const setupActions = (actions, actionsBp, options) => Object.keys(actionsBp.keys)
  .reduce((acc, actionName) => {
    const preReducerS = setupAction(
      options.appName,
      actionName,
      actions[actionName].streamS,
      actionsBp[actionName].pipe,
      options.functions,
      options.monitorS
    );
    acc[actionName].preReducerS = preReducerS;
    return acc;
  }, {});


const scopeReducer = (scope, reducerS) => reducerS.map(obs => [ scope, obs ]);


const createReducer = (obs, fn) => obs.map(fn);


const setupReducers = (preReducerStreams, actionsBp, functions) => Object.keys(actionsBp.keys)
  .filter(streamName =>
    actionsBp[streamName].hasOwnProperty('reducer') && !actionsBp[streamName].reducer)
  .reduce((acc, streamName) => {
    const reducerFnName = typeof actionsBp[streamName].reducer === 'boolean'
      ? `${streamName}Reducer`
      : actionsBp[streamName].reducer;
    const reducer = createReducer(
      preReducerStreams[streamName],
      getFunc(reducerFnName, functions)
    );
    acc[streamName] = scopeReducer(actionsBp[streamName].stateSelector, reducer);
    return acc;
  }, {});

const transformStreams = (keyName, obj) => Object.keys(obj)
  .reduce((acc, key) => {
    acc[key] = { [keyName]: obj[key] };
    return acc;
  }, {});

const blueprintSetup = (appInit, bp, functions) => {
  // load functions from bp
  const options = {
    appName:  bp.appName || 'app',
    monitorS: appInit.monitorS,
    functions
  };

  const preReducerStreams = setupActions(appInit.actions, bp.actions, options);
  const reducerStreams = setupReducers(preReducerStreams, bp.actions, options.functions);
  const reducersArray = Object.keys(reducerStreams).map(name => reducerStreams[name]);

  // combineReducers
  const reducerS = combineReducers(reducersArray);

  // make stateS
  const stateS = createScopedState(reducerS, bp.initialState);

  return deepmerge(
    appInit,
    { actions: transformStreams('preReducerS', preReducerStreams) },
    { actions: transformStreams('reducerS', reducerStreams) },
    {
      initialState: bp.initialState,
      reducerS,
      stateS,
      functions
    }
  );
};


export default {
  blueprintInit,
  blueprintSetup,
};

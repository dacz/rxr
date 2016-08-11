import Rx from 'rxjs';
import isObservable from 'is-observable';

export const initAction = () => {
  const streamS = new Rx.Subject;
  return {
    streamS,
    func: (val) => streamS.next(val)
  };
};

export const initActions = (actions) => Object.keys(actions)
  .reduce((acc, actionName) => {
    acc[actionName] = initAction();
    return acc;
  }, {});

export const wrapByMonitor = (streamName, obsS, monitorS) => (
  monitorS ? obsS.do((val) => monitorS.next([ streamName, val ])) : obsS
);

export const makePipedStream = (obsS, fn) => {
  const rv = fn(obsS);
  if (!isObservable(rv)) {
    throw new Error(`blueprint.makePipedStream: function takes Observable
    and has to return observable but it didn't. Returned: ${rv === null ? 'null' : typeof rv}`);
  }
  return rv;
};

export const getFunc = (fname, functions) => {
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

export const setupAction = (appName, streamName, subj, fname, functions, monitorS) => {
  let preReducerS = subj;
  if (fname) {
    preReducerS = makePipedStream(preReducerS, getFunc(fname, functions));
  }
  if (monitorS) preReducerS = wrapByMonitor(`${appName}:${streamName}`, preReducerS, monitorS);
  return preReducerS;
};


export const setupActions = (actions, actionsBp, options) => Object.keys(actionsBp.keys)
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


export const flattenArray = list => list.reduce(
  (a, b) => a.concat(Array.isArray(b) ? flattenArray(b) : b), []
);


export const normalizeScope = (arr) => flattenArray([].concat(arr.map(i => i || [])));


export const scopeReducer = (scope, reducerS) =>
  reducerS.map(func => [ normalizeScope(scope), func ]);


export const createReducer = (obs, fn) => obs.map(fn);


export const setupReducers = (preReducerStreams, actionsBp, options) =>
  Object.keys(actionsBp.keys)
  .filter(streamName =>
    actionsBp[streamName].hasOwnProperty('reducer') && !actionsBp[streamName].reducer)
  .reduce((acc, streamName) => {
    const reducerFnName = typeof actionsBp[streamName].reducer === 'boolean'
      ? `${streamName}Reducer`
      : actionsBp[streamName].reducer;
    const reducer = createReducer(
      preReducerStreams[streamName],
      getFunc(reducerFnName, options.functions)
    );
    acc[streamName] = scopeReducer(
      [ options.stateSelector, actionsBp[streamName].stateSelector ],
      reducer
    );
    return acc;
  }, {});

export const transformStreams = (keyName, obj) => Object.keys(obj)
  .reduce((acc, key) => {
    acc[key] = { [keyName]: obj[key] };
    return acc;
  }, {});

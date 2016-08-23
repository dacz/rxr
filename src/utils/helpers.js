import Rx from 'rxjs';
// import isObservable from 'is-observable';

export const initAction = () => {
  const streamS = new Rx.Subject;
  return {
    streamS,
    func: (val) => streamS.next(val)
  };
};

export const wrapByMonitor = (streamName, obsS, monitorS) => (
  monitorS ? obsS.do((val) => monitorS.next({ streamName, payload: val })) : obsS
);

export const conditionallyWrapByMonitor = (streamName, action, monitorS) => (
  !action.hasOwnProperty('monitor') || !!action.monitor
  ? wrapByMonitor(streamName, action.streamS, monitorS)
  : action.streamS
);

export const streamNameForMonitor = (appName, streamName) => `${appName}:${streamName}`;

export const getFunc = (fname, functions) => {
  if (typeof fname === 'function') return fname;
  if (typeof fname !== 'string') {
    throw new Error(`blueprint.setupReducers in blueprint are identified by name
    - they have to be string. Received: ${fname === null ? 'null' : typeof fname}
    Calling with: ${fname}`);
  }
  if (!functions[fname] || typeof functions[fname] !== 'function') {
    throw new Error(`blueprint.setupReducers in the blueprint
    was not provided within functions param passed to blueprint
    or it is not a function: ${fname === null ? 'null' : typeof fname}
    Calling with: ${fname}`);
  }
  return functions[fname];
};

export const flattenArray = list => list.reduce(
  (a, b) => a.concat(Array.isArray(b) ? flattenArray(b) : b), []
);


export const normalizeScope = (arr) => flattenArray([].concat(arr.map(i => i || [])));


export const scopeReducer = (scope, reducerS) =>
  reducerS.map(func => [ normalizeScope(scope), func ]);


export const createReducer = (obs, fn) => obs.map(fn);


// export const createActions = (app) => {
//   Object.keys(app.actions).forEach(actionName => {
//     // init Subjects
//     const action = Object.assign(app.actions[actionName], initAction());
//
//     // wrap by monitor
//     const streamName = streamNameForMonitor(app.appName, actionName);
//     action.streamS = conditionallyWrapByMonitor(streamName, action, app.monitorS);
//
//     // create reducerS
//     const reducerFnName = action.reducer
//       ? action.reducer
//       : `${actionName}Reducer`;
//     action.reducerS = scopeReducer(
//       [ app.stateSelector, action.stateSelector ],
//       createReducer( action.streamS, getFunc(reducerFnName, app.functions) )
//     );
//   });
//   return app;
// };

export const createActions = (app) =>
  Object.keys(app.actions).reduce((acc, actionName) => {
    // init Subjects
    const action = Object.assign(app.actions[actionName], initAction());

    // wrap by monitor
    const streamName = streamNameForMonitor(app.appName, actionName);
    action.streamS = conditionallyWrapByMonitor(streamName, action, app.monitorS);

    // create reducerS
    const reducerFnName = action.reducer
      ? action.reducer
      : `${actionName}Reducer`;
    action.reducerS = scopeReducer(
      [ app.stateSelector, action.stateSelector ],
      createReducer( action.streamS, getFunc(reducerFnName, app.functions) )
    );
    acc[actionName] = action;
    return acc;
  }, {});

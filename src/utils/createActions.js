import createActionStream from '../createActionStream';
import createPushToStreamFunction from './createPushToStreamFunction';
import { normalizeScope } from './helpers';

// export const createReducer = (obs, fn) => obs.map(fn);

export const createScopedReducer = (obs, fn, scope) =>
  obs
    .map(fn)
    .map(fns => [ normalizeScope(scope), fns ]);


export const createAction = (name, actionSetup) => {
  const stream = actionSetup.streamS ? actionSetup.streamS : createActionStream();
  return {
    [`${name}S`]: stream,
    [name]:       createPushToStreamFunction(stream)
  };
};

// app -> { actions: {}, reducers: {} }
export const createActions = (app) => {
  const actions = {};
  const reducers = {};

  Object.keys(app.actionsSetup)
    .forEach(key => {
      Object.assign(actions, createAction(key, app.actionsSetup[key]));
      const reducer = app.actionsSetup[key].reducer;
      if (reducer) {
        reducers[key] = createScopedReducer(
          actions[`${key}S`],
          reducer,
          app.actionsSetup[key].stateSelector
        );
      }
    });

  return { actions, reducers };
};

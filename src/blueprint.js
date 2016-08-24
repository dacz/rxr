import Rx from 'rxjs';
import combineReducers from './combineReducers';
import createScopedState from './createScopedState';
import wrapByMonitor from './wrapByMonitor';
import {
  createActions,
  streamNameForMonitor
} from './utils/helpers';

const blueprint = (bp, options) => {
  // copy bp to app
  const app = Object.assign({}, bp, options);

  // setup app name
  app.appName = bp.appName || 'app';

  // create monitor
  if (bp.monitor) app.monitorS = new Rx.Subject;

  // create actions and streams
  app.actions = createActions(app);

  // create reducerS
  app.reducerS = combineReducers(
    Object.keys(app.actions)
      .reduce((acc, actionName) => {
        acc.push(app.actions[actionName].reducerS);
        return acc;
      }, [])
  );

  // create stateS
  app.preStateS = createScopedState(app.reducerS, app.initialState);

  // add state to the monitor (if monitor)
  app.stateS = bp.monitor
    ? wrapByMonitor(streamNameForMonitor(app.appName, 'state'), app.preStateS, app.monitorS)
    : app.preStateS;

  // we are done
  return app;
};

export default blueprint;

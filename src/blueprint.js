import Rx from 'rxjs';
import combineReducers from './combineReducers';
import createScopedState from './createScopedState';
import {
  createActions
} from './utils/helpers';

const blueprint = (bp, options) => {
  // copy bp to app
  const app = Object.assign({}, bp, options);

  // setup app name
  app.appName = bp.appName || 'app';

  // create monitor
  if (bp.monitor) app.monitorS = new Rx.Subject;

  // create streams
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
  app.stateS = createScopedState(app.reducerS, app.initialState);

  // we are done
  return app;
};

export default blueprint;

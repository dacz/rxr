// import Rx from 'rxjs';
import combineStreams from './utils/combineStreams';
import createState from './utils/createState';
import createMonitor from './utils/createMonitor';
import {
  createActions
} from './utils/helpers';

const blueprint = (bp) => {
  // copy bp to app
  const app = Object.assign({}, bp);

  // setup app name
  app.appName = bp.appName || 'app';

  // create actions, streams and reducers
  const actionsAndReducers = createActions(app);
  Object.assign(app, actionsAndReducers);

  // create reducerS
  app.reducerS = combineStreams(Object.keys(actionsAndReducers.reducers));

  // create stateS
  app.stateS = createState(app.reducerS, app.initialState);

  // create monitor
  if (app.monitor) app.monitorS = createMonitor(app);

  // we are done
  return app;
};

export default blueprint;

import { identifyStream } from './helpers';
import combineStreams from './combineStreams';

const createMonitor = (app) => {
  const streams = Object.keys(app.actionsSetup)
    .filter(k => !app.actionsSetup[k].hasOwnProperty('monitor') || app.actionsSetup[k].monitor)
    .map(k => identifyStream(k, app.actions[`${k}S`]))
    .concat(identifyStream('state', app.stateS));

  return combineStreams(streams)
    .publishReplay(1)
    .refCount();
};

export default createMonitor;

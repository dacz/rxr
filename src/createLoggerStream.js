import Rx from 'rxjs';
import deepEqual from 'deep-equal';
import isObservable from 'is-observable';

/**
 * creates observable stream (hot) for logging or monitor
 * @param  {Observable} stateS Required. At least you have to monitor stateS
 *
 * @param  {Observables} ...other add any other observable (not as an array),
 * they will be merged and logged.
 * The stream should give items with the structure:
 * {
 * 		streamName: "name_of_the_stream",
 * 		payload: what you want to log
 * }
 *
 * @return {[Observable]} Stream that may be consumed by monitor or logger
 */
const createLoggerStream = (stateS, ...other) => {
  if (!stateS && !isObservable(stateS)) {
    throw new Error('createLoggerStream: you need to pass at least stateS stream.');
  }
  const otherToLog = other.filter(item => isObservable(item));

  const stateToLogS = stateS.map(state => ({ streamName: 'state', payload: state }));
  const toLog = [ stateToLogS, ...otherToLog ];

  return Rx.Observable.merge(...toLog)
    .distinctUntilChanged((a, b) => deepEqual(a, b))
    .publishReplay(1)
    .refCount();
};

export default createLoggerStream;

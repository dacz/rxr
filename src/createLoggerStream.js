import Rx from 'rxjs';
import deepEqual from 'deep-equal';
import isObservable from 'is-observable';

/**
 * creates observable stream (hot) for logging or monitor
 * @param  {Observable} state$ Required. At least you have to monitor state$
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
const createLoggerStream = (state$, ...other) => {
  if (!state$ && !isObservable(state$)) {
    throw new Error('createLoggerStream: you need to pass at least state$ stream.');
  }
  const otherToLog = other.filter(item => isObservable(item));

  const stateToLog$ = state$.map(state => ({ streamName: 'state', payload: state }));
  const toLog = [ stateToLog$, ...otherToLog ];

  return Rx.Observable.merge(...toLog)
    .distinctUntilChanged((a, b) => deepEqual(a, b))
    .publishReplay(1)
    .refCount();
};

export default createLoggerStream;

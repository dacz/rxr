import Rx from 'rxjs';
import isObservable from 'is-observable';
import { flattenArray } from './utils/helpers';

/**
 * combine multiple observable streams into one stream
 *
 * @param  {Array of Observables} one or many streams (Observables).
 *
 * @return {Observable}
 */
const combineStreams = (streams) => {
  const streamsAsArr = [].concat(streams);
  const flatened = flattenArray(streamsAsArr);
  const streamsArr = [].concat(flatened).filter(item => isObservable(item));
  return Rx.Observable.merge(...streamsArr);
};

export default combineStreams;

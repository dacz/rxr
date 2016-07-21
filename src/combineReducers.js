import Rx from 'rxjs';
import isObservable from 'is-observable';

const flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

/**
 * combine multiple reducers (observable streams of functions)
 * into one stream that is pushed to `createState`.
 *
 * It is the stream of functions that take one argument (state)
 * and generate newState with this function.
 *
 * @param  {Observables} reducers one or many reducers streams (Observables).
 * @return {Observable} Observable that produces functions how to
 * modify state.
 */
const combineReducers = (...reducers) => {
  const flatened = flatten(reducers);
  const reducersArr = [].concat(flatened).filter(item => isObservable(item));
  // console.log('RA: ', reducersArr);
  return Rx.Observable.merge(...reducersArr);
};

export default combineReducers;

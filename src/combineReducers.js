import Rx from 'rxjs';
import isObservable from 'is-observable';


/**
 * combine multiple reducers (observable streams of functions)
 * into one stream that is pushed to `createState`.
 *
 * It is the stream of functions that take one argument (state)
 * and generate newState with this function.
 *
 * @param  {Observable|Array} reducers one reducer or array of reducers
 * streams (Observables).
 * @return {Observable} Observable that produces functions how to
 * modify state.
 */
const combineReducers = (...reducers) => {
  const reducersArr = [].concat(reducers).filter(item => isObservable(item));
  // console.log('RA: ', reducersArr);
  return Rx.Observable.merge(...reducersArr);
};

// IDEA some flattening so the structure may go into this function and this structure can maintain even the state structure like Redux (branching the state).

export default combineReducers;

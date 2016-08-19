import Rx from 'rxjs';
import isObservable from 'is-observable';

/**
 * creates observable application state (stream)
 * You can subsrcibe to this stream and get the current state object
 * and new object every time the state changes.
 *
 * @param   {Observable} reducerS Stream of reducer functions
 * @param   {Observable|Object} initialState Initial state may be Observable
 *          or object (will be converted to Observable)
 * @returns {Observable} Observable stream of current state
 */
const createState = (reducerS, initialState = Rx.Observable.of({})) => {
  if (!isObservable(reducerS)) {
    throw new Error(`createState expects first argument - reducer - to be Observable
    but it is ${reducerS === null ? 'null' : typeof reducerS}`
    );
  }

  if (!isObservable(initialState) && typeof initialState !== 'object') {
    throw new Error(`createState expects second argument - initialState
      to be Observable or Object
      but it is ${initialState === null ? 'null' : typeof initialState}`
    );
  }

  const initialStateS = isObservable(initialState) ? initialState : Rx.Observable.of(initialState);

  return initialStateS
    .merge(reducerS)
    .scan((state, reducer) => reducer(state))
    .publishReplay(1)
    .refCount();
};

export default createState;

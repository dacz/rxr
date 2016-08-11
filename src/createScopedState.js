import Rx from 'rxjs';
import isObservable from 'is-observable';
import immutable from 'object-path-immutable';
import objectPath from 'object-path';

/**
 * creates observable application state (stream)
 * You can subsrcibe to this stream and get the current state object
 * and new object every time the state changes.
 *
 * @param   {Observable} reducer$ Stream of reducer functions
 * @param   {Observable|Object} initialState Initial state may be Observable
 *          or object (will be converted to Observable)
 * @returns {Observable} Observable stream of current state
 */
const createState = (reducer$, initialState = Rx.Observable.of({})) => {
  if (!isObservable(reducer$)) {
    throw new Error(`createState expects first argument - reducer - to be Observable
    but it is ${reducer$ === null ? 'null' : typeof reducer$}`
    );
  }

  if (!isObservable(initialState) && typeof initialState !== 'object') {
    throw new Error(`createState expects second argument - initialState
      to be Observable or Object
      but it is ${initialState === null ? 'null' : typeof initialState}`
    );
  }

  const initialState$ = isObservable(initialState) ? initialState : Rx.Observable.of(initialState);

  // TODO: make create state universal (if not scoped, it will use the whole state)
  return initialState$
    .merge(reducer$)
    .scan((state, [ scope, reducer ]) =>
      immutable.set(state, scope, reducer(objectPath(state, scope)))
    )
    .publishReplay(1)
    .refCount();
};

export default createState;

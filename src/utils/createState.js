import Rx from 'rxjs';
import isObservable from 'is-observable';
import immutable from 'object-path-immutable';
import objectPath from 'object-path';

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
    .scan((state, reducerItem) => {
      if (Array.isArray(reducerItem)) {
        const [ scope, reducer ] = reducerItem;
        // maybe we should use lenses here
        return immutable.set(state, scope, reducer(objectPath(state, scope)));
      }
      return reducerItem(state);
    })
    .publishReplay(1)
    .refCount();
};

export default createState;

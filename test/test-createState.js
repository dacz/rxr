import test from 'ava';
import Rx from 'rxjs';
import createState from '../src/createState';


test('creates state', t => {
  const reducer = state => ({ ...state, reducerCalled: (state.reducerCalled || 0) + 1 });
  const reducer$ = new Rx.Subject();
  const state$ = createState(reducer$);
  const valWanted = [
    {}, // it has PublishReplay and therefore gives initial value first
    { reducerCalled: 1 },
    { reducerCalled: 2 },
    { reducerCalled: 3 },
  ];
  state$.subscribe(val => {
    t.deepEqual(val, valWanted.shift());
  });

  reducer$.next(reducer);
  reducer$.next(reducer);
  reducer$.next(reducer);
});


test('creates state with initial state', t => {
  const initialState$ = Rx.Observable.of({ reducerCalled: 10 });
  const reducer = state => ({ ...state, reducerCalled: (state.reducerCalled || 0) + 1 });
  const reducer$ = new Rx.Subject();
  const state$ = createState(reducer$, initialState$);
  const valWanted = [
    { reducerCalled: 10 },
    { reducerCalled: 11 },
    { reducerCalled: 12 },
    { reducerCalled: 13 },
  ];
  state$.subscribe(val => {
    t.deepEqual(val, valWanted.shift());
  });

  reducer$.next(reducer);
  reducer$.next(reducer);
  reducer$.next(reducer);
});

test('creates state with initial state passed as an object', t => {
  const initialState = { reducerCalled: 10 };
  const reducer = state => ({ ...state, reducerCalled: (state.reducerCalled || 0) + 1 });
  const reducer$ = new Rx.Subject();
  const state$ = createState(reducer$, initialState);
  const valWanted = [
    { reducerCalled: 10 },
    { reducerCalled: 11 },
    { reducerCalled: 12 },
    { reducerCalled: 13 },
  ];
  state$.subscribe(val => {
    t.deepEqual(val, valWanted.shift());
  });

  reducer$.next(reducer);
  reducer$.next(reducer);
  reducer$.next(reducer);
});


test('throws when not proper reducer', t => {
  t.throws(() => createState({}));
});

import Rx from 'rxjs';
import test from 'ava';
import combineReducers from '../src/combineReducers';


test('combine reducers with one value', t => {
  const reducer1$ = new Rx.Subject;
  const combinedReducer$ = combineReducers(reducer1$);
  // shows us that it is "active"
  t.false(combinedReducer$._isScalar);
  const valWanted = [ 1, 2, 3 ];
  combinedReducer$.subscribe(val => {
    t.deepEqual(val, valWanted.shift());
  });

  reducer1$.next(1);
  reducer1$.next(2);
  reducer1$.next(3);
});

test('combine multiple reducers as an array', t => {
  const reducer1$ = new Rx.Subject;
  const reducer2$ = new Rx.Subject;
  const combinedReducer$ = combineReducers([ reducer1$, reducer2$ ]);
  t.false(combinedReducer$._isScalar);
  const valWanted = [ 1, 'a', 2, 3, 'b' ];
  combinedReducer$.subscribe(val => {
    t.is(val, valWanted.shift());
  });

  reducer1$.next(1);
  reducer2$.next('a');
  reducer1$.next(2);
  reducer1$.next(3);
  reducer2$.next('b');
});

test('combine multiple reducers as an array ref', t => {
  const reducer1$ = new Rx.Subject;
  const reducer2$ = new Rx.Subject;
  const reducerArray = [ reducer1$, reducer2$ ];
  const combinedReducer$ = combineReducers(reducerArray);
  t.false(combinedReducer$._isScalar);
  const valWanted = [ 1, 'a', 2, 3, 'b' ];
  combinedReducer$.subscribe(val => {
    t.is(val, valWanted.shift());
  });

  reducer1$.next(1);
  reducer2$.next('a');
  reducer1$.next(2);
  reducer1$.next(3);
  reducer2$.next('b');
});

test('combine multiple reducers', t => {
  const reducer1$ = new Rx.Subject;
  const reducer2$ = new Rx.Subject;
  const combinedReducer$ = combineReducers(reducer1$, reducer2$);
  t.false(combinedReducer$._isScalar);
  const valWanted = [ 1, 'a', 2, 3, 'b' ];
  combinedReducer$.subscribe(val => {
    t.is(val, valWanted.shift());
  });

  reducer1$.next(1);
  reducer2$.next('a');
  reducer1$.next(2);
  reducer1$.next(3);
  reducer2$.next('b');
});

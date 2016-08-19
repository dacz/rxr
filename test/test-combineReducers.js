import Rx from 'rxjs';
import test from 'ava';
import combineReducers from '../src/combineReducers';


test('combine reducers with one value', t => {
  const reducer1S = new Rx.Subject;
  const combinedreducerS = combineReducers(reducer1S);
  // shows us that it is "active"
  t.false(combinedreducerS._isScalar);
  const valWanted = [ 1, 2, 3 ];
  combinedreducerS.subscribe(val => {
    t.deepEqual(val, valWanted.shift());
  });

  reducer1S.next(1);
  reducer1S.next(2);
  reducer1S.next(3);
});

test('combine multiple reducers as an array', t => {
  const reducer1S = new Rx.Subject;
  const reducer2S = new Rx.Subject;
  const combinedreducerS = combineReducers([ reducer1S, reducer2S ]);
  t.false(combinedreducerS._isScalar);
  const valWanted = [ 1, 'a', 2, 3, 'b' ];
  combinedreducerS.subscribe(val => {
    t.is(val, valWanted.shift());
  });

  reducer1S.next(1);
  reducer2S.next('a');
  reducer1S.next(2);
  reducer1S.next(3);
  reducer2S.next('b');
});

import test from 'ava';
import Rx from 'rxjs';
import { debounceInput } from '../src/funcs/debounceInput';

test('debounceInput', t => {
  const int = Rx.Observable.interval(50).take(5);
  t.plan(1);
  return debounceInput(int)
    .scan((acc) => acc + 1, 0)
    .do(val => t.is(val, 1));
});

test('debounceInput - many', t => {
  const int = Rx.Observable.interval(150).take(5);
  t.plan(6);
  return debounceInput(int)
    .do(() => t.pass())
    .reduce((acc) => acc + 1, 0)
    .do(val => t.is(val, 5));
});

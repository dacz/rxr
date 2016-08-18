import test from 'ava';
import funcs from '../src/funcs';

// just to be sure that we get what we want
test(' all functions', t => {
  t.is(typeof funcs, 'object');
  t.is(typeof funcs.setFilterReducer, 'function');
  t.is(typeof funcs.debounceInput, 'function');
});

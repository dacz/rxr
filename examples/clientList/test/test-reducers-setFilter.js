import test from 'ava';
import actions from '../src/actions';
import reducer$ from '../src/reducers';


test('setFilter$', t => {
  const initialState = {};
  const valWanted = [
    { filter: 'somefilter' },
    { filter: 'elsefilter' },
    { filter: '' },
  ];
  reducer$.subscribe(fn => {
    t.deepEqual(fn(initialState), valWanted.shift());
  });

  actions.setFilter$.next('somefilter');
  actions.setFilter$.next('elsefilter');
  actions.setFilter$.next();
});

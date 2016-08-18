import test from 'ava';
import actions from '../src/actions';
import reducer$ from '../src/reducers';


test('selectClient$', t => {
  const initialState = {};
  const valWanted = [
    { selectedClient: 'someid' },
    { selectedClient: '' },
    { selectedClient: '' },
    { selectedClient: 'elseId' },
  ];
  reducer$.subscribe(fn => {
    t.deepEqual(fn(initialState), valWanted.shift());
  });

  actions.selectClient$.next('someid');
  actions.selectClient$.next('');
  actions.selectClient$.next();
  actions.selectClient$.next('elseId');
});

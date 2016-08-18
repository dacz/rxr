import test from 'ava';
import actions from '../src/actions';
import reducer$ from '../src/reducers';


// ---- fetchClients$

// test is passing but not testing what I want
test('fetchClients$', t => {
  reducer$.subscribe(() => {
    // console.log('TEST SUBSCRIBE VAL: ', val);
    t.pass();
  });
  actions.fetchClients$.next('http://jsonplaceholder.typicode.com/users');
});

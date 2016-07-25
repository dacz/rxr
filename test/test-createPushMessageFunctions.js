import test from 'ava';
import Rx from 'rxjs';
import createPushMessageFunctions from '../src/createPushMessageFunctions';

test('wraps one subject with next', t => {
  const action$ = new Rx.Subject;
  const action = createPushMessageFunctions(action$);
  const valWanted = [
    1,
    'some',
    { some: 'object' },
  ];

  action$.subscribe(val => {
    t.deepEqual(val, valWanted.shift());
  });

  action(1);
  action('some');
  action({ some: 'object' });
});

test('wraps object with subjects with next', t => {
  const subjObj = {
    a1: new Rx.Subject,
    a2: new Rx.Subject,
  };
  const actionObj = createPushMessageFunctions(subjObj);
  // all functions
  Object.keys(actionObj).forEach(item => {
    t.true(typeof actionObj[item] === 'function');
  });
  // test second
  const valWanted = [
    1,
    'some',
    { some: 'object' },
  ];

  subjObj.a2.subscribe(val => {
    t.deepEqual(val, valWanted.shift());
  });

  actionObj.a1(1);
  actionObj.a1('some');
  actionObj.a1({ some: 'object' });
});

test('test non valid params', t => {
  // undefined
  t.throws(() => createPushMessageFunctions());
  t.throws(() => createPushMessageFunctions('string'));
});

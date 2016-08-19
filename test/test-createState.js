import test from 'ava';
import Rx from 'rxjs';
import createState from '../src/createState';


test('creates state', t => {
  const reducer = state => ({ ...state, reducerCalled: (state.reducerCalled || 0) + 1 });
  const reducerS = new Rx.Subject();
  const stateS = createState(reducerS);
  const valWanted = [
    {}, // it has PublishReplay and therefore gives initial value first
    { reducerCalled: 1 },
    { reducerCalled: 2 },
    { reducerCalled: 3 },
  ];
  stateS.subscribe(val => {
    t.deepEqual(val, valWanted.shift());
  });

  reducerS.next(reducer);
  reducerS.next(reducer);
  reducerS.next(reducer);
});


test('creates state with initial state', t => {
  const initialStateS = Rx.Observable.of({ reducerCalled: 10 });
  const reducer = state => ({ ...state, reducerCalled: (state.reducerCalled || 0) + 1 });
  const reducerS = new Rx.Subject();
  const stateS = createState(reducerS, initialStateS);
  const valWanted = [
    { reducerCalled: 10 },
    { reducerCalled: 11 },
    { reducerCalled: 12 },
    { reducerCalled: 13 },
  ];
  stateS.subscribe(val => {
    t.deepEqual(val, valWanted.shift());
  });

  reducerS.next(reducer);
  reducerS.next(reducer);
  reducerS.next(reducer);
});

test('creates state with initial state passed as an object', t => {
  const initialState = { reducerCalled: 10 };
  const reducer = state => ({ ...state, reducerCalled: (state.reducerCalled || 0) + 1 });
  const reducerS = new Rx.Subject();
  const stateS = createState(reducerS, initialState);
  const valWanted = [
    { reducerCalled: 10 },
    { reducerCalled: 11 },
    { reducerCalled: 12 },
    { reducerCalled: 13 },
  ];
  stateS.subscribe(val => {
    t.deepEqual(val, valWanted.shift());
  });

  reducerS.next(reducer);
  reducerS.next(reducer);
  reducerS.next(reducer);
});


test('throws when not proper reducer', t => {
  t.throws(() => createState({}));
});

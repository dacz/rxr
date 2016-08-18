import test from 'ava';
import sinon from 'sinon';
import Rx from 'rxjs';
import { loadClientsAsync } from '../src/funcs/loadClientsAsync';

// sign: loadClientsAsync(obs, notifyLoading, receivedData)

test('loadClientsAsync', t => {
  const notifyLoading = sinon.spy();
  const receivedData = sinon.spy();
  const obs = Rx.Observable.of(1);
  t.plan(2);
  // console.log(loadClientsAsync(obs, notifyLoading, receivedData));
  return loadClientsAsync(obs, notifyLoading, receivedData)
    .do(() => {
      t.true(notifyLoading.calledOnce);
      t.true(receivedData.calledOnce);
    });
});

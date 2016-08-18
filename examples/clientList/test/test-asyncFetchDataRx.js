import test from 'ava';
import asyncFetchDataRx from '../src/utils/asyncFetchDataRx';
const CLIENTS_DATA_URL = 'http://jsonplaceholder.typicode.com/users';

// TODO we need somehow to stub the fetch for asyncFetchDataRx (mock fetch!)

test('asyncFetchDataRx', t => {
  const ds$ = asyncFetchDataRx(CLIENTS_DATA_URL);
  return ds$.do((data) => {
    t.is(data.length, 10);
  });
});

test('asyncFetchDataRx - error', t => {
  const ds$ = asyncFetchDataRx('http://somenonexistenturlshjshdj.com');
  return ds$.do((err) => {
    t.true(err instanceof Error);
  });
});

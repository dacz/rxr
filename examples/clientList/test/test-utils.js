import test from 'ava';
import deepFreeze from 'deep-freeze';
import { findInObj } from '../src/utils';

test('findInObj - plain object', t => {
  const obj = {
    prop1: 'val1',
    prop2: 'aval2i',
  };
  deepFreeze(obj);
  t.true(findInObj(obj, 'val1'));
  t.true(findInObj(obj, 'VAL2'));
  t.false(findInObj(obj, 'nothere'));
});

test('findInObj - nested object', t => {
  const obj = {
    prop1: 'val1',
    prop2: 'aval2i',
    prop3: {
      nprop1: 'nestedv1',
      nprop2: 'nestedv2',
    },
  };
  deepFreeze(obj);
  t.true(findInObj(obj, 'tedv2'));
  t.true(findInObj(obj, 'TEDV1'));
  t.false(findInObj(obj, 'nothere'));
});

import test from 'ava';
import { assignDefined } from './utils';

const from = {
  a: 1,
  b: 2,
  c: 3
};

test('check that object with null properties are skipped', t => {
  const to = {
    a: null,
    b: 'b',
    c: 'c'
  };
  const actual = assignDefined({ ...from }, to);
  const expected = {
    a: 1,
    b: 'b',
    c: 'c'
  };
  t.deepEqual(actual, expected);
});

test('check that basic object assign mechanisms work', t => {
  const to = {
    a: 'a',
    b: 'b',
    c: 'c'
  };
  const actual = assignDefined({ ...from }, to);
  t.deepEqual(actual, to);
});

test('check that object with undefined properties are skipped', t => {
  t.log(from);
  const to = {
    a: 'a',
    b: undefined,
    c: undefined
  };

  const actual = assignDefined({ ...from }, to);
  const expected = {
    a: 'a',
    b: 2,
    c: 3
  };
  t.deepEqual(actual, expected);
});

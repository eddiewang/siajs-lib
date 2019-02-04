import test from 'ava';
import BigNumber from 'bignumber.js';
import { toHastings, toSiacoins } from './currency';

const HASTINGS_PER_SIACOIN = '1000000000000000000000000';

test('converts from siacoins to hastings correctly', t => {
  const maxSC = new BigNumber('100000000000000000000000');
  for (let i = 0; i < 100; i++) {
    const sc = maxSC.times(Math.trunc(Math.random() * 10000) / 10000);
    const expectedHastings = sc.times(HASTINGS_PER_SIACOIN);
    t.is(toHastings(sc).toString(), expectedHastings.toString());
  }
});

test('converts from hastings to siacoins correctly', t => {
  const maxH = new BigNumber('10').pow(150);
  for (let i = 0; i < 100; i++) {
    const hastings = maxH.times(Math.trunc(Math.random() * 10000) / 10000);
    const expectedSiacoins = hastings.dividedBy(HASTINGS_PER_SIACOIN);
    t.is(toSiacoins(hastings).toString(), expectedSiacoins.toString());
  }
});

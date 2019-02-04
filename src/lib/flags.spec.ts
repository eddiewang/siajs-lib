import test from 'ava';
import { some } from 'lodash';
import { parseFlags, parseModules } from './flags';
import { ClientConfig, ModuleConfig } from './proto';
// parseModules

test('return full set of modules', t => {
  const moduleConfig: ModuleConfig = {
    consensus: true,
    explorer: true,
    gateway: true,
    host: true,
    miner: true,
    renter: true,
    transactionPool: true,
    wallet: true
  };
  const m = parseModules(moduleConfig);
  t.is(m, 'ceghmrtw');
});

// parseFlags

const FULL_CONFIG: ClientConfig = {
  agent: 'foo',
  apiAuthentication: true,
  apiAuthenticationPassword: 'xyz',
  dataDirectory: 'bar',
  modules: {
    consensus: true,
    explorer: true,
    gateway: true,
    host: true,
    miner: true,
    renter: true,
    transactionPool: true,
    wallet: true
  }
};

test('ensure default flags return same length', t => {
  const config: ClientConfig = {};
  const flagList = parseFlags(config);
  t.is(flagList.length, 3);
});

test('ensure custom flags return more flags', t => {
  const flagList = parseFlags(FULL_CONFIG);
  t.is(flagList.length, 8);
});

test('ensure string flags are printed out correctly', t => {
  const flagList = parseFlags(FULL_CONFIG);
  t.true(some(flagList, x => x.includes('--agent=')));
  t.true(some(flagList, x => x.includes('--api-addr=')));
  t.true(some(flagList, x => x.includes('--authenticate-api=')));
  t.true(some(flagList, x => x.includes('--host-addr=')));
  t.true(some(flagList, x => x.includes('--modules=')));
  t.true(some(flagList, x => x.includes('--rpc-addr=')));
  t.true(some(flagList, x => x.includes('--sia-directory=')));
  t.true(some(flagList, x => x.includes('--temp-password=')));
});

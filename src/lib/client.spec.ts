import test from 'ava';
import { some } from 'lodash';
import sinon from 'sinon';
import { Client } from './client';

// Resets the sinon sandbox after each test
test.afterEach(() => {
  sinon.restore();
});

// Creates a context object that can be used to replace any method
test.beforeEach(t => {
  t.context = {
    f: sinon.fake()
  };
});

// Global constants
const BIN_PATH = '/Users';

test('can create client with no config', t => {
  const { f }: any = t.context;
  const client = new Client({});
  sinon.replace(client, 'spawn', f);
  client.launch(BIN_PATH);
  const a = f.args[0];
  const path = a[0];
  const flags: string[] = a[1];
  // This should match daemon path passed into the function
  t.is(path, BIN_PATH);

  // Check that default flags are passed in
  const hasApiAddr = flags.includes('--api-addr=localhost:9980');
  const hasHostAddr = flags.includes('--host-addr=:9982');
  const hasRpcAddr = flags.includes('--rpc-addr=:9981');
  t.true(hasApiAddr);
  t.true(hasHostAddr);
  t.true(hasRpcAddr);
});

test('can replace client config', t => {
  const { f }: any = t.context;
  const client = new Client({
    agent: 'custom-agent',
    apiAuthentication: true,
    apiAuthenticationPassword: 'foo',
    apiHost: '1.1.1.1',
    apiPort: 1337,
    dataDirectory: 'bar',
    hostPort: 1339,
    modules: {
      consensus: true,
      explorer: true,
      gateway: true,
      host: true,
      miner: false,
      renter: true,
      transactionPool: true,
      wallet: true
    },
    rpcPort: 1338
  });
  sinon.replace(client, 'spawn', f);
  client.launch(BIN_PATH);
  const a: string[] = f.args[0][1];

  t.is(a.length, 8);
  t.true(some(a, x => x.includes('--agent=custom-agent')));
  t.true(some(a, x => x.includes('--api-addr=1.1.1.1:1337')));
  t.true(some(a, x => x.includes('--authenticate-api=true')));
  t.true(some(a, x => x.includes('--host-addr=:1339')));
  // skipped module test because we have a seperate unit test for parseModules
  t.true(some(a, x => x.includes('--rpc-addr=:1338')));
  t.true(some(a, x => x.includes('--sia-directory=bar')));
  t.true(some(a, x => x.includes('--temp-password=foo')));
});

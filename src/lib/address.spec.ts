import test from 'ava';
import { isValidAddress } from './address';

test('should return true for valid siacoin addresses', t => {
  t.true(
    isValidAddress(
      'a9b01c85163638682b170d82de02b8bb99ba86092e9ab1b0d25111284fe618e93456915820f1'
    )
  );
  t.true(
    isValidAddress(
      'ab0c327982abfcc6055a6c9551589167d8a73501aca8769f106371fbc937ad100c955c3b7ba9'
    )
  );
  t.true(
    isValidAddress(
      'ffe1308c044ade30392a0cdc1fd5a4dbe94f9616a95faf888ed36123d9e711557aa497530373'
    )
  );
});

test('should return false for invalid siacoin addresses', t => {
  t.false(isValidAddress('bNEMVqeUZUqTrYUxud5ehnUhtTAiWDXQ5e'));
  t.false(
    isValidAddress(
      '0xa0859a061c1bc863ebafe49203dca8196c7deba26aa7f86be80728423e8da21c'
    )
  );
  t.false(isValidAddress('1A1zP1ePQGefi2DMPTifTL5SLmv7DivfNa'));
});

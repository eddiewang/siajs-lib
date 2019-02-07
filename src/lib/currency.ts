import { BigNumber } from 'bignumber.js';

// Siacoin -> hastings unit conversion functions
// These make conversion between units of Sia easy and consistent for developers.
// Never return exponentials from BigNumber.toString, since they confuse the API
BigNumber.config({ EXPONENTIAL_AT: 1e9 });
BigNumber.config({ DECIMAL_PLACES: 30 });

// Hastings is the lowest divisible unit in Sia. This constant will be used to
// calculate the conversion between the base unit to human readable values.
const hastingsPerSiacoin = new BigNumber('10').exponentiatedBy(24);

export function toSiacoins(hastings: BigNumber | number) {
  return new BigNumber(hastings).dividedBy(hastingsPerSiacoin);
}

export function toHastings(siacoins: BigNumber | number) {
  return new BigNumber(siacoins).times(hastingsPerSiacoin);
}

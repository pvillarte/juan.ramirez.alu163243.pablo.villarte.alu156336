const ERR = Object.freeze({
  EMPTY_INPUT: 'Input cannot be empty.',
  INT_RANGE: 'Integer must be in range 1-3999.',
  ROMAN_RANGE: 'Roman value out of supported range (1-3999).',
  INT_DIGITS_ONLY: 'Integer input must contain only digits.',
  INT_NOT_SAFE: 'Integer input is not a safe number.',
  INVALID_CHAR: (ch) => `Invalid character "${ch}".`,
  INVALID_REPETITION: (ch) => `Invalid repetition of "${ch}".`,
  INVALID_SUBTRACTIVE_PAIR: (prev, curr) => `Invalid subtractive pair "${prev}${curr}".`,
  INVALID_REPETITION_BEFORE_SUB: (prev, curr) =>
    `Invalid repetition before subtraction near "${prev}${curr}".`,
  TWO_SUBTRACTIVES: 'Two subtractive pairs in a row are not allowed.',
  REPEATED_SUBTRACTIVE_PAIR: (prev, curr) =>
    `Repeated subtractive pair "${prev}${curr}" is not allowed.`,
  NON_CANONICAL: 'Roman numeral is not in canonical form.'
});

const romanValues = Object.freeze({
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
});

const romanTokenRules = Object.freeze({
  I: { maxRepeat: 3, canSubtractFrom: new Set(['V', 'X']) },
  X: { maxRepeat: 3, canSubtractFrom: new Set(['L', 'C']) },
  C: { maxRepeat: 3, canSubtractFrom: new Set(['D', 'M']) },
  M: { maxRepeat: 3, canSubtractFrom: new Set([]) },
  V: { maxRepeat: 1, canSubtractFrom: new Set([]) },
  L: { maxRepeat: 1, canSubtractFrom: new Set([]) },
  D: { maxRepeat: 1, canSubtractFrom: new Set([]) },
});

const romanEncodingTable = Object.freeze([
  { value: 1000, symbol: 'M' },
  { value: 900, symbol: 'CM' },
  { value: 500, symbol: 'D' },
  { value: 400, symbol: 'CD' },
  { value: 100, symbol: 'C' },
  { value: 90, symbol: 'XC' },
  { value: 50, symbol: 'L' },
  { value: 40, symbol: 'XL' },
  { value: 10, symbol: 'X' },
  { value: 9, symbol: 'IX' },
  { value: 5, symbol: 'V' },
  { value: 4, symbol: 'IV' },
  { value: 1, symbol: 'I' },
]);

const RomanConverter = (() => {

  const Ok = (value) => ({ ok: true, value });
  const Err = (error) => ({ ok: false, error });

  const ERR = Object.freeze({
    EMPTY_INPUT: "Input cannot be empty.",
    INT_RANGE: "Integer must be in range 1-3999.",
    ROMAN_RANGE: "Roman value out of supported range (1-3999).",
    INT_DIGITS_ONLY: "Integer input must contain only digits.",
    INT_NOT_SAFE: "Integer input is not a safe number.",
    INVALID_CHAR: (ch) => `Invalid character "${ch}".`,
    INVALID_REPETITION: (ch) => `Invalid repetition of "${ch}".`,
    INVALID_SUBTRACTIVE_PAIR: (prev, curr) => `Invalid subtractive pair "${prev}${curr}".`,
    INVALID_REPETITION_BEFORE_SUB: (prev, curr) =>
      `Invalid repetition before subtraction near "${prev}${curr}".`,
    TWO_SUBTRACTIVES: "Two subtractive pairs in a row are not allowed.",
    REPEATED_SUBTRACTIVE_PAIR: (prev, curr) =>
      `Repeated subtractive pair "${prev}${curr}" is not allowed.`,
    NON_CANONICAL: "Roman numeral is not in canonical form."
  });

  const normalizeUpper = (raw) =>
    String(raw ?? "").trim().toUpperCase();

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
    I: { maxRepeat: 3, canSubtractFrom: new Set(["V", "X"]) },
    X: { maxRepeat: 3, canSubtractFrom: new Set(["L", "C"]) },
    C: { maxRepeat: 3, canSubtractFrom: new Set(["D", "M"]) },
    M: { maxRepeat: 3, canSubtractFrom: new Set([]) },
    V: { maxRepeat: 1, canSubtractFrom: new Set([]) },
    L: { maxRepeat: 1, canSubtractFrom: new Set([]) },
    D: { maxRepeat: 1, canSubtractFrom: new Set([]) },
  });

  const romanEncodingTable = Object.freeze([
    { value: 1000, symbol: "M" },
    { value: 900, symbol: "CM" },
    { value: 500, symbol: "D" },
    { value: 400, symbol: "CD" },
    { value: 100, symbol: "C" },
    { value: 90, symbol: "XC" },
    { value: 50, symbol: "L" },
    { value: 40, symbol: "XL" },
    { value: 10, symbol: "X" },
    { value: 9, symbol: "IX" },
    { value: 5, symbol: "V" },
    { value: 4, symbol: "IV" },
    { value: 1, symbol: "I" },
  ]);

  const integerToRoman = (n) => {
    if (!isIntegerInRange(n)) {
      return Err(ERR.INT_RANGE);
    }

    let remaining = n;
    let out = "";

    for (const entry of romanEncodingTable) {
      while (remaining >= entry.value) {
        out += entry.symbol;
        remaining -= entry.value;
      }
    }

    return Ok(out);
  };

  const romanToInteger = (raw) => {
    const input = normalizeUpper(raw);
    if (input.length === 0) {
      return Err(ERR.EMPTY_INPUT);
    }

    let sum = 0;

    for (let i = 0; i < input.length; i++) {
      const current = romanValues[input[i]];
      const next = i + 1 < input.length ? romanValues[input[i + 1]] : 0;

      if (!current) {
        return Err(ERR.INVALID_CHAR(input[i]));
      }

      if (current < next) {
        sum -= current;
      } else {
        sum += current;
      }
    }

    if (!isIntegerInRange(sum)) {
      return Err(ERR.ROMAN_RANGE);
    }

    return Ok(sum);
  };

  const validateRomanStrict = (raw) => {
    const input = normalizeInput(raw);
    if (!input.ok) return input;

    const charCheck = validateCharacters(input.value);
    if (!charCheck.ok) return charCheck;

    const structureCheck = validateStructure(input.value);
    if (!structureCheck.ok) return structureCheck;

    const canonicalCheck = validateCanonical(input.value);
    if (!canonicalCheck.ok) return canonicalCheck;

    return Ok(input.value);
  };

  const isIntegerInRange = (n) => Number.isInteger(n) && n >= 1 && n <= 3999;

  function normalizeInput(raw) {
    const value = normalizeUpper(raw);
    if (value.length === 0) {
      return Err(ERR.EMPTY_INPUT);
    }
    return Ok(value);
  }

  function validateCharacters(input) {
    for (const ch of input) {
      if (!romanValues[ch]) {
        return Err(ERR.INVALID_CHAR(ch));
      }
    }
    return Ok();
  }

  function validateStructure(input) {
    let repeatCount = 1;
    let lastChar = input[0];
    let lastWasSubtractive = false;
    let lastSubtractiveSmall = null;
    let lastSubtractiveLarge = null;

    for (let i = 1; i < input.length; i++) {
      const current = input[i];
      const prev = input[i - 1];
      const currentValue = romanValues[current];
      const prevValue = romanValues[prev];

      repeatCount = current === lastChar ? repeatCount + 1 : 1;
      lastChar = current;

      const maxRepeat = romanTokenRules[current].maxRepeat;
      if (repeatCount > maxRepeat) {
        return Err(ERR.INVALID_REPETITION(current));
      }

      if (prevValue < currentValue) {
        const subtractCheck = validateSubtractivePair({
          prev,
          current,
          repeatCount,
          lastWasSubtractive,
          lastSubtractiveSmall,
          lastSubtractiveLarge
        });
        if (!subtractCheck.ok) return subtractCheck;

        lastWasSubtractive = true;
        lastSubtractiveSmall = prev;
        lastSubtractiveLarge = current;
      } else {
        lastWasSubtractive = false;
      }
    }
    return Ok();
  }

  function validateSubtractivePair({
    prev,
    current,
    repeatCount,
    lastWasSubtractive,
    lastSubtractiveSmall,
    lastSubtractiveLarge
  }) {
    const rules = romanTokenRules[prev];

    if (!rules.canSubtractFrom.has(current)) {
      return Err(ERR.INVALID_SUBTRACTIVE_PAIR(prev, current));
    }

    if (repeatCount !== 1) {
      return Err(ERR.INVALID_REPETITION_BEFORE_SUB(prev, current));
    }

    if (lastWasSubtractive) {
      return Err(ERR.TWO_SUBTRACTIVES);
    }

    if (lastSubtractiveSmall === prev && lastSubtractiveLarge === current) {
      return Err(ERR.REPEATED_SUBTRACTIVE_PAIR(prev, current));
    }

    return Ok();
  }

  function validateCanonical(input) {
    const parsed = romanToInteger(input);
    if (!parsed.ok) return parsed;

    const canonical = integerToRoman(parsed.value);
    if (!canonical.ok) return canonical;

    if (canonical.value !== input) {
      return Err(ERR.NON_CANONICAL);
    }

    return Ok();
  }

  const parseIntegerStrict = (raw) => {
    const input = String(raw ?? "").trim();
    if (input.length === 0) {
      return Err(ERR.EMPTY_INPUT);
    }
    if (!/^\d+$/.test(input)) {
      return Err(ERR.INT_DIGITS_ONLY);
    }

    const n = Number(input);
    if (!Number.isSafeInteger(n)) {
      return Err(ERR.INT_NOT_SAFE);
    }
    if (!isIntegerInRange(n)) {
      return Err(ERR.INT_RANGE);
    }
    return Ok(n);
  };

  return Object.freeze({
    parseIntegerStrict,
    validateRomanStrict,
    integerToRoman,
    romanToInteger,
  });
})();

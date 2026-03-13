const RomanConverter = (() => {
  const romanValue = Object.freeze({
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

  const integerToRomanMap = Object.freeze([
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
      return { ok: false, error: "Integer must be in range 1-3999." };
    }

    let remaining = n;
    let out = "";

    for (const entry of integerToRomanMap) {
      while (remaining >= entry.value) {
        out += entry.symbol;
        remaining -= entry.value;
      }
    }

    return { ok: true, value: out };
  };

  const romanToInteger = (raw) => {
    const input = String(raw ?? "").trim().toUpperCase();
    if (input.length === 0) {
      return { ok: false, error: "Input cannot be empty." };
    }

    let sum = 0;

    for (let i = 0; i < input.length; i++) {
      const current = romanValue[input[i]];
      const next = i + 1 < input.length ? romanValue[input[i + 1]] : 0;

      if (!current) {
        return { ok: false, error: `Invalid character "${input[i]}".` };
      }

      if (current < next) {
        sum -= current;
      } else {
        sum += current;
      }
    }

    if (!isIntegerInRange(sum)) {
      return { ok: false, error: "Roman value out of supported range (1-3999)." };
    }

    return { ok: true, value: sum };
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

    return { ok: true, value: input.value };
  };

  const isIntegerInRange = (n) => Number.isInteger(n) && n >= 1 && n <= 3999;

  function normalizeInput(raw) {
    const value = String(raw ?? "").trim().toUpperCase();
    if (value.length === 0) {
      return { ok: false, error: "Input cannot be empty." };
    }
    return { ok: true, value };
  }

  function validateCharacters(input) {
    for (const ch of input) {
      if (!romanValue[ch]) {
        return { ok: false, error: `Invalid character "${ch}".` };
      }
    }
    return { ok: true };
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
      const currentValue = romanValue[current];
      const prevValue = romanValue[prev];

      repeatCount = current === lastChar ? repeatCount + 1 : 1;
      lastChar = current;

      const maxRepeat = romanTokenRules[current].maxRepeat;
      if (repeatCount > maxRepeat) {
        return { ok: false, error: `Invalid repetition of "${current}".` };
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

    return { ok: true };
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
      return { ok: false, error: `Invalid subtractive pair "${prev}${current}".` };
    }

    if (repeatCount !== 1) {
      return {
        ok: false,
        error: `Invalid repetition before subtraction near "${prev}${current}".`
      };
    }

    if (lastWasSubtractive) {
      return {
        ok: false,
        error: "Two subtractive pairs in a row are not allowed."
      };
    }

    if (lastSubtractiveSmall === prev && lastSubtractiveLarge === current) {
      return {
        ok: false,
        error: `Repeated subtractive pair "${prev}${current}" is not allowed.`
      };
    }

    return { ok: true };
  }

  function validateCanonical(input) {
    const parsed = romanToInteger(input);
    if (!parsed.ok) return parsed;

    const canonical = integerToRoman(parsed.value);
    if (!canonical.ok) return canonical;

    if (canonical.value !== input) {
      return { ok: false, error: "Roman numeral is not in canonical form." };
    }

    return { ok: true };
  }

  const parseIntegerStrict = (raw) => {
    const input = String(raw ?? "").trim();
    if (input.length === 0) {
      return { ok: false, error: "Input cannot be empty." };
    }
    if (!/^\d+$/.test(input)) {
      return { ok: false, error: "Integer input must contain only digits." };
    }

    const n = Number(input);
    if (!Number.isSafeInteger(n)) {
      return { ok: false, error: "Integer input is not a safe number." };
    }
    if (!isIntegerInRange(n)) {
      return { ok: false, error: "Integer must be in range 1-3999." };
    }
    return { ok: true, value: n };
  };

  return Object.freeze({
    parseIntegerStrict,
    validateRomanStrict,
    integerToRoman,
    romanToInteger,
  });
})();
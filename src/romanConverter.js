const integerToRoman = (n) => {
  if (!isIntegerInRange(n)) return Err(ERR.INT_RANGE);

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
  if (input.length === 0) return Err(ERR.EMPTY_INPUT);

  let sum = 0;

  for (let i = 0; i < input.length; i++) {
    const current = romanValues[input[i]];
    const next = i + 1 < input.length ? romanValues[input[i + 1]] : 0;

    if (!current) return Err(ERR.INVALID_CHAR(input[i]));

    sum += current < next ? -current : current;
  }

  if (!isIntegerInRange(sum)) return Err(ERR.ROMAN_RANGE);

  return Ok(sum);
};

function normalizeInput(raw) {
  const value = normalizeUpper(raw);
  if (value.length === 0) return Err(ERR.EMPTY_INPUT);
  return Ok(value);
}

function validateCharacters(input) {
  for (const ch of input) {
    if (!romanValues[ch]) return Err(ERR.INVALID_CHAR(ch));
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

  if (!rules.canSubtractFrom.has(current))
    return Err(ERR.INVALID_SUBTRACTIVE_PAIR(prev, current));

  if (repeatCount !== 1)
    return Err(ERR.INVALID_REPETITION_BEFORE_SUB(prev, current));

  if (lastWasSubtractive)
    return Err(ERR.TWO_SUBTRACTIVES);

  if (lastSubtractiveSmall === prev && lastSubtractiveLarge === current)
    return Err(ERR.REPEATED_SUBTRACTIVE_PAIR(prev, current));

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

    repeatCount = updateRepeatCount(current, lastChar, repeatCount);
    lastChar = current;

    const maxRepeat = romanTokenRules[current].maxRepeat;
    if (repeatCount > maxRepeat)
      return Err(ERR.INVALID_REPETITION(current));

    if (prevValue < currentValue) {
      const check = validateSubtractivePair({
        prev,
        current,
        repeatCount,
        lastWasSubtractive,
        lastSubtractiveSmall,
        lastSubtractiveLarge
      });
      if (!check.ok) return check;

      lastWasSubtractive = true;
      lastSubtractiveSmall = prev;
      lastSubtractiveLarge = current;
    } else {
      lastWasSubtractive = false;
    }
  }

  return Ok();
}

function validateCanonical(input) {
  const parsed = romanToInteger(input);
  if (!parsed.ok) return parsed;

  const canonical = integerToRoman(parsed.value);
  if (!canonical.ok) return canonical;

  if (canonical.value !== input)
    return Err(ERR.NON_CANONICAL);

  return Ok();
}

const validateRomanStrict = (raw) => {
  const input = normalizeInput(raw);
  if (!input.ok) return input;

  const chars = validateCharacters(input.value);
  if (!chars.ok) return chars;

  const structure = validateStructure(input.value);
  if (!structure.ok) return structure;

  const canonical = validateCanonical(input.value);
  if (!canonical.ok) return canonical;

  return Ok(input.value);
};

const parseIntegerStrict = (raw) => {
  const input = String(raw ?? "").trim();
  if (input.length === 0) return Err(ERR.EMPTY_INPUT);
  if (!/^\d+$/.test(input)) return Err(ERR.INT_DIGITS_ONLY);

  const n = Number(input);
  if (!Number.isSafeInteger(n)) return Err(ERR.INT_NOT_SAFE);
  if (!isIntegerInRange(n)) return Err(ERR.INT_RANGE);

  return Ok(n);
};

const RomanConverter = Object.freeze({
  parseIntegerStrict,
  validateRomanStrict,
  integerToRoman,
  romanToInteger,
});

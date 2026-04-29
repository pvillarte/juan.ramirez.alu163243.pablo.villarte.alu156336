const Ok = (value) => ({ ok: true, value });
const Err = (error) => ({ ok: false, error });

const normalizeUpper = (raw) =>
  String(raw ?? '').trim().toUpperCase();

const isIntegerInRange = (n) =>
  Number.isInteger(n) && n >= 1 && n <= 3999;

const updateRepeatCount = (current, lastChar, repeatCount) =>
  current === lastChar ? repeatCount + 1 : 1;

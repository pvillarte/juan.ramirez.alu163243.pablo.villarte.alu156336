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

  const isIntegerInRange = (n) => Number.isInteger(n) && n >= 1 && n <= 3999;

  const integerToRoman = (n) => {
    if (!isIntegerInRange(n)) {
      return { ok: false, error: "Integer must be in range 1–3999." };
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

  const validateRomanStrict = (raw) => {
    const input = String(raw ?? "").trim().toUpperCase();
    if (input.length === 0) {
      return { ok: false, error: "Input cannot be empty." };
    }

    for (const ch of input) {
      if (!romanValue[ch]) {
        return { ok: false, error: `Invalid character "${ch}".` };
      }
    }

    let repeatCount = 1;
    let lastChar = input[0];

    let lastTokenValue = romanValue[lastChar];
    let lastWasSubtractive = false;

    let lastSubtractiveSmall = null;
    let lastSubtractiveLarge = null;

    for (let i = 1; i < input.length; i++) {
      const current = input[i];
      const currentValue = romanValue[current];

      if (current === lastChar) {
        repeatCount += 1;
      } else {
        repeatCount = 1;
        lastChar = current;
      }

      const maxRepeat = romanTokenRules[current].maxRepeat;
      if (repeatCount > maxRepeat) {
        return { ok: false, error: `Invalid repetition of "${current}".` };
      }

      const prev = input[i - 1];
      const prevValue = romanValue[prev];

      if (prevValue < currentValue) {
        const rules = romanTokenRules[prev];
        if (!rules.canSubtractFrom.has(current)) {
          return { ok: false, error: `Invalid subtractive pair "${prev}${current}".` };
        }

        if (repeatCount !== 1) {
          return { ok: false, error: `Invalid repetition before subtraction near "${prev}${current}".` };
        }

        if (lastWasSubtractive) {
          return { ok: false, error: "Two subtractive pairs in a row are not allowed." };
        }

        if (lastSubtractiveSmall === prev && lastSubtractiveLarge === current) {
          return { ok: false, error: `Repeated subtractive pair "${prev}${current}" is not allowed.` };
        }

        lastWasSubtractive = true;
        lastSubtractiveSmall = prev;
        lastSubtractiveLarge = current;
      } else {
        lastWasSubtractive = false;
      }

      lastTokenValue = currentValue;
    }

    const parsed = romanToInteger(input);
    if (!parsed.ok) return parsed;

    const canonical = integerToRoman(parsed.value);
    if (!canonical.ok) return canonical;

    if (canonical.value !== input) {
      return { ok: false, error: "Roman numeral is not in canonical form." };
    }

    return { ok: true, value: input };
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
      return { ok: false, error: "Roman value out of supported range (1–3999)." };
    }

    return { ok: true, value: sum };
  };

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
      return { ok: false, error: "Integer must be in range 1–3999." };
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

const RomanConverterUI = (() => {
  const elements = {
    form: document.getElementById("converterForm"),
    mode: document.getElementById("mode"),
    input: document.getElementById("inputValue"),
    inputLabel: document.getElementById("inputLabel"),
    result: document.getElementById("resultValue"),
    status: document.getElementById("statusValue"),
    reset: document.getElementById("resetBtn"),
  };

  const setStatus = (message, kind) => {
    elements.status.textContent = message;
    elements.status.style.color = kind === "error" ? "var(--danger)" : kind === "ok" ? "var(--ok)" : "";
  };

  const clearOutputs = () => {
    elements.result.textContent = "—";
    setStatus("Ready", "neutral");
  };

  const setModeLabels = () => {
    const mode = elements.mode.value;
    const isIntToRoman = mode === "intToRoman";

    elements.inputLabel.textContent = isIntToRoman ? "Integer (1–3999)" : "Roman numeral (I,V,X,L,C,D,M)";
    elements.input.value = "";
    clearOutputs();

    elements.input.inputMode = isIntToRoman ? "numeric" : "text";
    elements.input.placeholder = isIntToRoman ? "e.g., 1999" : "e.g., MCMXCIX";
  };

  const convert = () => {
    clearOutputs();

    const mode = elements.mode.value;
    const raw = elements.input.value;

    if (mode === "intToRoman") {
      const parsed = RomanConverter.parseIntegerStrict(raw);
      if (!parsed.ok) {
        setStatus(parsed.error, "error");
        return;
      }

      const converted = RomanConverter.integerToRoman(parsed.value);
      if (!converted.ok) {
        setStatus(converted.error, "error");
        return;
      }

      elements.result.textContent = converted.value;
      setStatus("Converted successfully.", "ok");
      return;
    }

    const validated = RomanConverter.validateRomanStrict(raw);
    if (!validated.ok) {
      setStatus(validated.error, "error");
      return;
    }

    const converted = RomanConverter.romanToInteger(validated.value);
    if (!converted.ok) {
      setStatus(converted.error, "error");
      return;
    }

    elements.result.textContent = String(converted.value);
    setStatus("Converted successfully.", "ok");
  };

  const bind = () => {
    elements.mode.addEventListener("change", setModeLabels);
    elements.form.addEventListener("submit", (e) => {
      e.preventDefault();
      convert();
    });
    elements.reset.addEventListener("click", () => {
      elements.input.value = "";
      clearOutputs();
      elements.input.focus();
    });

    setModeLabels();
    clearOutputs();
  };

  return Object.freeze({ bind });
})();

RomanConverterUI.bind();
